import Opportunity from '../models/Opportunity.js';

// @desc    Get all opportunities (Handles Search & Filters)
// @route   GET /api/opportunities
export const getOpportunities = async (req, res) => {
  try {
    const {
      q,
      search,
      organization,
      type,
      activityTypes,
      status,
      excludeStatus,
      minHours,
      maxHours,
      from,
      to,
      sort,
      order
    } = req.query;

    const searchTerm = q || search;
    const andConditions = [];

    if (searchTerm) {
      const regex = { $regex: searchTerm.trim(), $options: 'i' };
      andConditions.push({
        $or: [
          { title: regex },
          { organization: regex },
          { description: regex },
          { activityType: regex }
        ]
      });
    }

    if (organization) {
      andConditions.push({ organization: organization });
    }

    const selectedTypes = type || activityTypes;
    if (selectedTypes) {
      const typesArray = String(selectedTypes)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      if (typesArray.length > 0) {
        andConditions.push({ activityType: { $in: typesArray } });
      }
    }

    if (status && status !== 'any') {
      andConditions.push({ status: status });
    }

    if (excludeStatus) {
      andConditions.push({ status: { $ne: excludeStatus } });
    }

    if (minHours || maxHours) {
      const hoursFilter = {};
      if (minHours) hoursFilter.$gte = Number(minHours);
      if (maxHours) hoursFilter.$lte = Number(maxHours);
      andConditions.push({ 'capacity.requiredHours': hoursFilter });
    }

    if (from || to) {
      const dateFilter = {};
      if (from) dateFilter.$gte = new Date(from);
      if (to) dateFilter.$lte = new Date(`${to}T23:59:59.999Z`);
      andConditions.push({ date: dateFilter });
    }

    const query = andConditions.length > 0 ? { $and: andConditions } : {};

    let mongooseQuery = Opportunity.find(query);

    if (sort === 'date') {
      mongooseQuery = mongooseQuery.sort({ date: order === 'desc' ? -1 : 1 });
    } else if (sort === 'createdAt') {
      mongooseQuery = mongooseQuery.sort({ createdAt: order === 'desc' ? -1 : 1 });
    }

    const opportunities = await mongooseQuery;
    res.status(200).json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new opportunity
// @route   POST /api/opportunities
export const createOpportunity = async (req, res) => {
  try {
    const newOpportunity = await Opportunity.create(req.body);
    res.status(201).json(newOpportunity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an opportunity (Requires PIN)
// @route   PUT /api/opportunities/:id
export const updateOpportunity = async (req, res) => {
  try {
    const { passcode, ...updateData } = req.body;

    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });

    if (opportunity.passcode !== passcode) {
      return res.status(401).json({ message: 'Unauthorized: Incorrect PIN' });
    }

    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedOpportunity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an opportunity (Requires PIN)
// @route   DELETE /api/opportunities/:id
export const deleteOpportunity = async (req, res) => {
  try {
    const { passcode } = req.body;

    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });

    if (opportunity.passcode !== passcode) {
      return res.status(401).json({ message: 'Unauthorized: Incorrect PIN' });
    }

    await opportunity.deleteOne();
    res.status(200).json({ message: 'Opportunity removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.status(200).json(opportunity);
  } catch (error) {
    console.error('Error fetching single opportunity:', error);
    res.status(500).json({ message: 'Server error fetching opportunity' });
  }
};

export const validatePasscode = async (req, res) => {
  try {
    const { passcode } = req.body;

    if (!passcode) {
      return res.status(400).json({ message: 'PIN is required' });
    }

    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    if (String(opportunity.passcode) !== String(passcode)) {
      return res.status(401).json({ message: 'Unauthorized: Incorrect PIN' });
    }

    res.status(200).json({ valid: true, message: 'PIN verified' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};