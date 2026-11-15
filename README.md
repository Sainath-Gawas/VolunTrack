# VolunTrack

A full-stack MERN web application designed to streamline community volunteering. VolunTrack empowers organizations to post opportunities, manage volunteer capacities and track community impact in real-time through a secure, PIN-authorized dashboard.

## Core Features

### Dynamic Analytics Dashboard

- **MongoDB Aggregation:** Dashboard statistics are calculated on the backend using MongoDB's aggregation framework instead of processing the entire opportunity dataset in React.
- **Single API Request:** The frontend fetches dashboard statistics through the `/api/opportunities/stats` endpoint, reducing multiple API calls.
- **Aggregation with `$facet`:** A single aggregation pipeline executes three independent operations:
  - **Summary:** Calculates total active opportunities, total pledged hours, and remaining volunteers needed.
  - **Category Breakdown:** Groups opportunities by activity type and counts the opportunities in each category.
  - **Needs Attention:** Identifies open opportunities marked as "High" or "Critical" urgency scheduled within the next 14 days.
- **Efficient Data Processing:** MongoDB performs filtering, grouping, counting, and calculations on the database side, while React focuses on displaying the returned results.

### Smart Feed & Advanced Filtering

- The frontend React components construct dynamic URL query parameters based on user selections (e.g., ?search=blanket&minHours=2&status=Open).

- Backend Processing: The Express controller translates these parameters into complex MongoDB queries using operators like $regex for partial text matching, $gte/$lte for date and hour ranges, and $in for multiple activity types.

### PIN-Secured Organization Controls (CRUD)

- Instead of a heavy user authentication system, individual opportunity cards are protected by a custom 4-digit PIN created by the organization at the time of posting.

- Security Flow: When a user attempts to edit or delete a post, the React frontend prompts for the PIN. The Express backend uses findById() to retrieve the document, verifies the entered PIN against the stored passcode and only executes the findByIdAndUpdate or deleteOne Mongoose commands if the authorization passes.

### Flexible Capacity & Boolean Logic

- The platform accommodates both strict numerical requirements (e.g., exactly 5 volunteers for 4 hours) and flexible community drives (e.g., unlimited blanket sorting all day).

- Database Handling: Checking "Flexible Hours" or "Unlimited Capacity" on the frontend forces the numeric inputs to null in the JSON payload. The Mongoose schema stores these as embedded boolean flags (isFlexibleHours, isUnlimitedVolunteers), which the frontend then reads to dynamically swap numerical displays with custom UI text tags.

### Status-Driven UI/UX

- The opportunity cards feature color-coded status badges. When an organization changes an event status to "Filled" or "Closed", the React frontend applies conditional Tailwind utility classes to visually dim the inactive cards, keeping user focus on actionable, open opportunities.

## Tech Stack & Architecture

### Frontend

- React.js, Tailwind CSS
- State Management: React Hooks (useState, useEffect, useMemo)

### Backend (Server)

- Node.js, Express.js (RESTful API architecture)

### Database:

- MongoDB Atlas (Cloud NoSQL database)
- ODM: Mongoose

## Database Schema Structure

The Mongoose schema (`Opportunity.js`) utilizes strict type casting, enums, and embedded documents to validate all incoming requests before writing to the database. The schema also implements `{ timestamps: true }` to automatically generate `createdAt` and `updatedAt` fields.

**Root Level Fields:**

- `title`, `description`, `organization`, `activityType`: `String` (Required)
- `date`: `Date` (Required)
- `urgency`: `String` (Enum: `['Normal', 'High', 'Critical']`, Default: `'Normal'`)
- `status`: `String` (Enum: `['Open', 'Filled', 'Closed']`, Default: `'Open'`)
- `passcode`: `String` (Required) — Used for PIN-based authorization for edits/deletions.
- `imageUrl`: `String` (Optional)
- `skillsRequired`: `[String]` (Array of Strings)

**Embedded `capacity` Document:**
Handles the logic for both flexible drives and strict numerical volunteer caps.

- `isFlexibleHours`: `Boolean` (Default: `false`)
- `requiredHours`: `Number` (Set to `null` if flexible)
- `isUnlimitedVolunteers`: `Boolean` (Default: `false`)
- `volunteersNeeded`: `Number` (Set to `null` if unlimited)
- `volunteersSignedUp`: `Number` (Default: `0`)

**Embedded `location` Document:**

- `city`: `String` (Required)
- `pinCode`: `String` (Required)

**Embedded `contactPerson` Document:**

- `name`: `String` (Required)
- `email`: `String` (Required)
