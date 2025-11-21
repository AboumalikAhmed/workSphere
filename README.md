## 🚀 Installation

1. **Clone or download** the project files
2. **Ensure file structure** is maintained as above
3. **Open** `index.html` in a modern web browser
4. **No server required** - runs completely client-side

### Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Internet connection (for Font Awesome icons)

## 💻 Usage

### Adding Employees

1. Click **"add_new_worker"** button
2. Fill in the form with:
   - Full name
   - Email address
   - Phone number
   - Profile image URL (optional)
   - Role selection
   - Work experiences (optional)
3. Submit the form

### Room Assignment

1. Click **"+"** button in any room
2. Select from available employees with appropriate access
3. Employees move from "Unassigned Staff" to the room
4. Use **"×"** button to remove employees from rooms

### Viewing Details

- Click on employee cards to view full details
- Click on assigned employees in rooms for quick view

## ⚙️ Configuration

### Main Configuration

- **Room Capacity**: 5 employees per room
- **Required Rooms**: Server Room, Security Room, Reception, Archives Room
- **Default Avatar**: ./Asset/images/user.jpg

### Available Rooms

- 🏛️ Conference Room (Salle de conference)
- 🖥️ Server Room (Salle des serveurs) - _Required_
- 🛡️ Security Room (Salle de securite) - _Required_
- 🏢 Reception (Reception) - _Required_
- 👥 Staff Room (Salle du personnel)
- 📁 Archives Room (Salle darchives) - _Required_

## 🔐 Roles and Access

| Role            | Accessible Rooms                  |
| --------------- | --------------------------------- |
| Manager         | All rooms                         |
| Cleaning Staff  | All except Archives               |
| Security Agents | Security Room only                |
| IT Technicians  | Server Room only                  |
| Other Roles     | Reception, Conference, Staff Room |

## 💾 Data Storage

The application uses browser's LocalStorage for data persistence:

- **workerData**: Employee information and profiles
- **assignedWorkers**: Room assignments and occupancy

## ✅ Validation Rules

### Field Validations

- **Email**: Standard email format
- **Phone**: Minimum 10 digits (allows spaces, dashes, parentheses)
- **Full Name**: 2-50 alphabetical characters and spaces
- **Image URL**: Valid URL with supported extensions (png, jpg, jpeg, gif, webp)

### Date Validation

- Experience dates must be valid ranges
- End date cannot be before start date

## 🎨 Responsive Design

### Breakpoints

- **Desktop**: Horizontal layout with sidebar (≥769px)
- **Mobile**: Vertical stacked layout (≤768px)

### Mobile Features

- Responsive grid layout
- Touch-friendly interface
- Optimized spacing for mobile devices

## 🛡️ Security Features

- **XSS Protection** with input sanitization
- **Client-side validation** for all inputs
- **Role-based access control**
- **Room capacity limits**
- **Safe URL handling** for images

## 🎯 Typical Workflow

1. **Add employees** with their qualifications and experiences
2. **Review unassigned staff** in the left sidebar
3. **Assign to rooms** based on roles and competencies
4. **Monitor alerts** for critical empty rooms
5. **Manage modifications** as needed

## 🐛 Troubleshooting

### Common Issues

- **Data not saving**: Check if LocalStorage is enabled
- **Images not loading**: Verify URL format and CORS policies
- **Form not submitting**: Check validation errors in red text

### Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

---

_Developed for optimal human and spatial resource management in corporate environments._
