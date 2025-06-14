# CREST - Definitive UI/UX Architecture & Design Guide

## 1. Core Philosophy & Guiding Principles

This document outlines the final, agreed-upon User Interface (UI) and User Experience (UX) architecture for the CREST application. It serves as the blueprint for all frontend development.

*   **Principle 1: Clear Separation of Concerns.** The application's structure must clearly distinguish between global navigation and contextual actions. A user should never be confused about "where they are" or "what they can do here."

*   **Principle 2: Project Context is Paramount.** CREST is a multi-project platform. The UI must always make it obvious which project is currently active. All data, actions, and permissions are filtered through this active project context.

*   **Principle 3: Role-Aware Interfaces.** The UI is not one-size-fits-all. It must adapt to the user's role within a project, showing powerful administrative tools to a **Project Lead** and a focused, task-oriented interface to a **Researcher** or **Data Entry** clerk.

*   **Principle 4: Optimized Clinical Workflow.** For the core task of data submission, the interface must prioritize speed, clarity, and touch-friendliness, minimizing cognitive load and accommodating the real-world scenario of managing multiple, concurrent patient encounters.

## 2. Layout Architecture: The Three Core Components

The entire application is built upon a consistent three-component layout model.

### 2.1. The `TopBar`: The Global Application Frame

The `TopBar` is a static, persistent header present on every page of the application. Its purpose is to provide high-level, global navigation between the primary modules of CREST.

*   **Left Section:**
    *   **CREST Logo:** Always links to the main application Dashboard (`/`).
    *   **Sidebar Toggle Button:** A hamburger/list icon that is **only visible and active** when the user is within a Project Workspace (i.e., on a `/project/:id/*` route). It controls the collapsed/expanded state of the Project Workspace Sidebar.

*   **Center Section (Main Navigation):**
    *   A static, always-visible set of text links to the application's main modules.
    *   `Dashboard`: (`/`) The user's personal landing page.
    *   `Projects`: (`/projects`) The list of all projects the user is a member of.
    *   `Forms Library`: (`/forms`) A global library of reusable form templates.
    *   `Settings`: (`/settings`) The user's account and application settings.

*   **Right Section (User Controls):**
    *   `Notifications`: A bell icon for global alerts.
    *   `Theme Toggle`: A sun/moon icon to switch between light and dark modes.
    *   `User Menu`: A dropdown showing the user's name and avatar, with links to Profile and Logout.

### 2.2. The `Main Content Area`: The Workspace

This is the largest part of the screen. It renders the content of the currently active page. Its width and content are determined by the active route.

### 2.3. The `Project Workspace Sidebar`: The Project Navigator

This is a dynamic and powerful component that **only appears when the user is inside a specific project** (i.e., on a `/project/:id/*` route). It is not a generic toolkit; it is the primary navigation and context panel for the active project.

*   **Appearance:** It occupies the left side of the screen, pushing the Main Content Area to the right. It can be collapsed by the user to an icon-only view or expanded to show full text labels.
*   **Content:**
    1.  **Project Context Header:** Displays the name of the currently active project and includes a dropdown (`ContextSwitcher`) to quickly jump to other projects the user has access to.
    2.  **Project Navigation Menu:** A vertical list of links to the different sections *within the active project*. The items in this menu are filtered based on the user's role in that project.

## 3. State Management & Context Model

*   **Global State (Zustand):** Used for application-wide data that is frequently accessed and updated.
    *   `authStore`: Manages `user` info, `isAuthenticated` status, and the `JWT`.
    *   `projectStore`: Manages the list of `availableProjects` and, most importantly, the `activeProjectId`. Setting `activeProjectId` is the trigger that makes the application enter "Project Workspace" mode.
    *   `uiStore`: Manages the global UI state, specifically the `isSidebarOpen` boolean that controls the Project Workspace Sidebar.

*   **URL as State:** The route (URL) is the primary driver of what is displayed. The layout and components react to the URL, not the other way around. This ensures the UI is predictable and shareable.

## 4. Core Application Modules & Page-Specific UX

This section details the specific UI/UX for each major page, as dictated by the global navigation in the `TopBar`.

### 4.1. Dashboard (`/`)

*   **Layout:** Full-width (no sidebar).
*   **Purpose:** The user's personal, high-level launchpad.
*   **Content:**
    *   A prominent `DashboardGreetingCard` welcoming the user.
    *   A grid of `ProjectCard` components for "favorite" or "recently accessed" projects.
    *   A global activity feed showing recent actions across all the user's projects (e.g., "Dr. Smith completed a submission for Project ERAS," "A new form 'Post-Op v2' was created in Project Respirar").

### 4.2. Projects List (`/projects`)

*   **Layout:** Full-width (no sidebar).
*   **Purpose:** The definitive entry point for accessing a project.
*   **Content:**
    *   A searchable and filterable list/grid of all projects the user is a member of.
    *   Each project entry displays its name, description, and the user's role(s) in it.
    *   A primary "Create New Project" button (visible based on global permissions).
    *   **Action:** Clicking on a project in this list sets the `activeProjectId` in the `projectStore` and navigates the user to that project's `Overview` page (`/project/:id/overview`).

### 4.3. The Project Workspace (`/project/:id/*`)

When a user enters this route, the `Project Workspace Sidebar` appears. The content of the `Main Content Area` is determined by the specific sub-route.

#### 4.3.1. Project Overview (`/project/:id/overview`)

*   **Sidebar Navigation:** The `Overview` link is active.
*   **Main Content:** A dashboard of widgets specific to the active project.
    *   **For All Members:** Widgets showing "Total Submissions," "Active Encounters," "Project Activity Log."
    *   **For Project Leads:** Additional administrative widgets like "Pending Member Invites," "Data Quality Flags," "Pending Form Reviews."

#### 4.3.2. Data Submissions Hub (`/project/:id/submissions`)

*   **Sidebar Navigation:** The `Data Submissions` link is active.
*   **Main Content (Two-State View):**
    1.  **State 1: The Submission Queue (Default View).** This is the management hub.
        *   A table/list of all patient encounters for this project.
        *   **Columns:** Patient Pseudonym, Status (`In Progress`, `Completed`, `Flagged for Review`), Current Form Step (e.g., "Intraoperative"), Last Updated, Assigned Clinician.
        *   **Controls:** Search and filter controls for the queue.
        *   **Primary Action:** A prominent "Start New Patient Encounter" button.
    2.  **State 2: The Focused Encounter Flow.**
        *   **Trigger:** Occurs when a user clicks "Start New" or an existing "In Progress" encounter from the queue.
        *   **UI:** The view transitions to the dedicated, step-by-step form-filling interface. The URL might change to `/project/:id/submissions/:encounterId` to make the state bookmarkable.
        *   The `submissionStore` is activated to manage the state of this specific encounter.
        *   A clear "Save & Close" or "Back to Queue" button is always visible to return to State 1.

#### 4.3.3. Form Builder (`/project/:id/builder`)

*   **Sidebar Navigation:** The `Form Builder` link is active.
*   **Main Content (Internal Two-Panel Layout):**
    *   **Left Panel:** A list of all forms belonging to the active project. Includes a "Create New Form" button.
    *   **Right Panel (The Editor):** When a form is selected from the left panel, this area displays the three-column editor: `Toolbox` | `Canvas` | `Inspector`.

#### 4.3.4. Members & Roles (`/project/:id/members`)

*   **Sidebar Navigation:** The `Members & Roles` link is active.
*   **Purpose:** The command center for the Project Lead to manage project access and governance.
*   **Main Content (Internal Two-Panel Layout):**
    *   **Left Panel:** Two lists: one for all project `Members` and one for all custom `Roles`. Includes an "Invite New Member" button.
    *   **Right Panel (The Editor):** This area is populated based on the selection in the left panel.
        *   *Member Selected:* Shows member details and a multi-select checklist to assign/un-assign roles.
        *   *Role Selected:* Shows the `Role Editor` interface to configure the name, description, and granular permissions for that role.

## 5. Key User Workflows

### Workflow 1: A Researcher's Data Entry Session

1.  User logs in and lands on the **Dashboard (`/`)**.
2.  Clicks **`Projects`** in the `TopBar`.
3.  On the **Projects List (`/projects`)**, they find "ERAS Pediátrico" and click it.
4.  They are navigated to the **Project Workspace (`/project/eras-ped/overview`)**. The `Project Workspace Sidebar` appears.
5.  They click **`Data Submissions`** in the sidebar.
6.  They see the **Submission Queue**. They see "Patient JS" is "In Progress." They click it.
7.  The view transitions to the **Focused Encounter Flow**. The system loads the draft, and they are on the "Intraoperative" form step.
8.  They fill out the form and click "Next." The data is saved.
9.  They click "Save & Close" to return to the **Submission Queue**.
10. They click "Start New Patient Encounter" to begin work on another patient.

### Workflow 2: A Project Lead's Setup Session

1.  User logs in and navigates to the "ERAS Pediátrico" project workspace.
2.  In the `Project Workspace Sidebar`, they click **`Members & Roles`**.
3.  In the left panel, they click "Invite New Member," fill out an email, and assign the "Data Entry" role.
4.  Next, they click **`Form Builder`** in the sidebar.
5.  In the Form Builder's left panel, they click "Create New Form."
6.  They use the `Toolbox`, `Canvas`, and `Inspector` to build a new "30-Day Follow-Up" form and save it to the project.
