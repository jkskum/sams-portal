import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService, User } from '../../service/user-services';
import intlTelInput from 'intl-tel-input';

@Component({
  selector: 'app-user-create-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-create-edit.component.html',
  styleUrls: ['./user-create-edit.component.css']
})

export class UserCreateEditComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('phoneInput', { static: false }) phoneInput!: ElementRef;
  
  private iti: any;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  isEditMode = false;
  userId: number | null = null;

  countries: string[] = [
    'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria',
    'Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan',
    'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia',
    'Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo (Congo-Brazzaville)','Costa Rica',
    'Côte d’Ivoire','Croatia','Cuba','Cyprus','Czechia (Czech Republic)','Democratic Republic of the Congo','Denmark','Djibouti','Dominica','Dominican Republic',
    'Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini (fmr. "Swaziland")','Ethiopia','Fiji','Finland',
    'France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea',
    'Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq',
    'Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait',
    'Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg',
    'Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico',
    'Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar (formerly Burma)','Namibia','Nauru',
    'Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman',
    'Pakistan','Palau','Palestine State','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal',
    'Qatar','Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe',
    'Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia',
    'South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria',
    'Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan',
    'Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States of America','Uruguay','Uzbekistan','Vanuatu','Venezuela',
    'Vietnam','Yemen','Zambia','Zimbabwe'
  ];

  user: User = {
    id: 0,
    username: '',
    name: '',
    email: '',
    role: '',
    age: 0,
    gender: '',
    phone: '',
    country: '',
    city: '',
    institute: '',
    department: '',
    qualification: '',
    language: '',
    address: '',
    profilePicture: ''
  };

  firstName = '';
  lastName = '';

  // Password field (not part of User model yet) and validation pattern
  password: string = '';
  // At least 8 chars, one letter, one number, one special character
  passwordPattern: string = '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$';

  // Track phone validity and touch state for template validation
  phoneValid = false;
  phoneTouched = false;
  // Hidden control value that represents phone validity for template-driven form
  phoneFormValue: string = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = parseInt(id, 10);
      this.loadUserData(this.userId);
    }
  }

  ngAfterViewInit() {
    // Destroy any previous instance defensively
    if (this.iti && typeof this.iti.destroy === 'function') {
      this.iti.destroy();
    }

    // Initialize plugin deterministically
    this.iti = intlTelInput(this.phoneInput.nativeElement, {
      preferredCountries: ['in', 'ke'],
      initialCountry: 'in',
      separateDialCode: true,
      nationalMode: true,
      formatOnDisplay: false, // avoid flicker
      autoPlaceholder: 'aggressive',
      utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js'
    });

    // If editing, set the existing number (visible will be national due to nationalMode)
    if (this.isEditMode && this.user.phone) {
      this.iti.setNumber(this.user.phone);
      const utils = (window as any).intlTelInputUtils;
      const e164Init = utils ? this.iti.getNumber(utils.numberFormat.E164) : this.iti.getNumber();
      this.user.phone = e164Init;
      this.phoneValid = this.iti.isValidNumber();
      this.phoneFormValue = this.phoneValid ? 'valid' : '';
    }

    // Keep model in sync and validate on changes
    this.phoneInput.nativeElement.addEventListener('countrychange', () => {
      this.phoneTouched = true;
      this.onPhoneChange();
      this.validatePhoneNumber();
    });
    this.phoneInput.nativeElement.addEventListener('input', () => {
      this.phoneTouched = true;
      this.onPhoneChange();
    });
    this.phoneInput.nativeElement.addEventListener('blur', () => {
      this.phoneTouched = true;
      this.validatePhoneNumber();
    });

    // Re-validate once utils script is loaded (as it loads async)
    const checkUtils = () => (window as any).intlTelInputUtils;
    const utilsPoll = setInterval(() => {
      if (checkUtils()) {
        clearInterval(utilsPoll);
        // Run a validation pass once utils are available
        this.validatePhoneNumber();
      }
    }, 100);
  }

  ngOnDestroy() {
    // Clean up intl-tel-input instance
    if (this.iti) {
      this.iti.destroy();
    }
  }

  onPhoneChange() {
    if (this.iti) {
      const utils = (window as any).intlTelInputUtils;
      // Save model as E.164 only; do not touch the input's visible value to avoid flicker
      const e164 = utils ? this.iti.getNumber(utils.numberFormat.E164) : this.iti.getNumber();
      this.user.phone = e164;
      // Update validity live
      this.phoneValid = this.iti.isValidNumber();
      this.phoneFormValue = this.phoneValid ? 'valid' : '';
    }
  }

  validatePhoneNumber(): boolean {
    if (!this.iti) {
      this.phoneValid = false;
      this.phoneFormValue = '';
      return false;
    }

    const utils = (window as any).intlTelInputUtils;
    const isValid = typeof this.iti.isValidNumber === 'function' ? this.iti.isValidNumber() : false;

    if (isValid) {
      // Store E.164 in the model; do not modify the input value
      this.user.phone = utils ? this.iti.getNumber(utils.numberFormat.E164) : this.iti.getNumber();
      this.phoneValid = true;
      this.phoneFormValue = 'valid';
      return true;
    } else {
      this.phoneValid = false;
      this.phoneFormValue = '';
      return false;
    }
  }


  loadUserData(userId: number) {
    this.userService.getUserById(userId).subscribe(user => {
      if (user) {
        this.user = { ...user };
        const nameParts = user.name.split(' ');
        this.firstName = nameParts[0] || '';
        this.lastName = nameParts.slice(1).join(' ') || '';
      }
    });
  }

  updateFullName() {
    this.user.name = `${this.firstName} ${this.lastName}`.trim();
  }

  // Profile picture upload properties
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isDragOver = false;
  uploadStatus: {type: 'success' | 'error', message: string} | null = null;
  maxFileSize = 2 * 1024 * 1024; // 2MB for profile pictures
  private fileDialogInProgress = false; // guard to prevent double-opening

  // File Selection Handler
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
    // Clear the guard once selection completes
    this.fileDialogInProgress = false;
  }

  // Drag and Drop Event Handlers
  onDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Only set to false if we're leaving the drop zone entirely
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || 
        event.clientY < rect.top || event.clientY > rect.bottom) {
      this.isDragOver = false;
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
      event.dataTransfer.clearData();
    }
    // Ensure guard is cleared if file was dropped
    this.fileDialogInProgress = false;
  }

  // File Processing and Validation
  handleFile(file: File) {
    // Validate file type (only JPEG/PNG for profiles)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      this.showUploadStatus('error', 'Please select a JPEG or PNG image file.');
      return;
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      this.showUploadStatus('error', 'Image size must be less than 2MB.');
      return;
    }

    this.selectedFile = file;
    this.previewImage(file);
    this.uploadStatus = null;
  }

  // Create Image Preview
  previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  // Trigger File Input Click
  triggerFileInput() {
    const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
    if (fileInput) {
      // Guard against rapid double triggers (double-click) and bubbled clicks
      if (this.fileDialogInProgress) return;
      this.fileDialogInProgress = true;
      // Reset value so selecting the same file again still triggers change
      fileInput.value = '';
      fileInput.click();
      // Fallback to clear guard in case change doesn't fire
      setTimeout(() => { this.fileDialogInProgress = false; }, 1500);
    }
  }

  // Remove Selected Image
  removeImage(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.selectedFile = null;
    this.previewUrl = null;
    this.resetFileInput();
    this.uploadStatus = null;
  }

  // Reset File Input Value
  resetFileInput() {
    const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Get File Size in Human Readable Format
  getFileSize(): string {
    // console.log(this.selectedFile);
    if (!this.selectedFile) return '';
    
    const bytes = this.selectedFile.size;
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // Get Dynamic Button Text
  getButtonText(): string {
    if (this.previewUrl) return 'Change Picture';
    if (this.user.profilePicture && this.isEditMode) return 'Update Picture';
    return 'Choose Picture';
  }

  // Get Profile Picture URL for Display
  getProfilePictureUrl(): string {
    if (this.user.profilePicture) {
      // If it's a full URL (from cloud storage)
      if (this.user.profilePicture.startsWith('http')) {
        return this.user.profilePicture;
      }
      // If it's a relative path (from local server)
      // You'll need to define your API base URL
      return `http://localhost:3000/uploads/profiles/${this.user.profilePicture}`;
      // Or use environment variable:
      // return `${environment.apiUrl}/uploads/profiles/${this.user.profilePicture}`;
    }
    return 'assets/default-avatar.jpeg'; // Default avatar
  }

  // Show Upload Status Messages
  showUploadStatus(type: 'success' | 'error', message: string) {
    this.uploadStatus = { type, message };
    // Auto-hide after 5 seconds
    setTimeout(() => this.uploadStatus = null, 5000);
  }

  // Safer click handlers to avoid bubbling causing double-open
  onUploadButtonClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.triggerFileInput();
  }

  onEditPictureClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.triggerFileInput();
  }

  onContainerClick(event: MouseEvent) {
    // If click originated from a button or input inside, do nothing (they stop propagation themselves)
    const target = event.target as HTMLElement;
    if (target.closest('button, input, .btn')) {
      return;
    }
    this.triggerFileInput();
  }

  onSubmit(form: NgForm): void {
    // Prevent submit if template-driven form invalid
    if (form.invalid) {
      this.phoneTouched = true;
      form.form.markAllAsTouched();
      this.validatePhoneNumber();
      return;
    }
    
    this.updateFullName();
    
    if (this.isEditMode && this.userId) {
      const { id, ...userWithoutId } = this.user;
      this.userService.updateUser(this.userId, userWithoutId).subscribe(updatedUser => {
        if (updatedUser) {
          console.log('User updated successfully:', updatedUser);
          this.router.navigate(['user/user-list']);
        }
      });
    } else {
      const { id, ...userWithoutId } = this.user;
      this.userService.createUser(userWithoutId).subscribe(createdUser => {
        console.log('User created successfully:', createdUser);
        this.router.navigate(['user/user-list']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['user/user-list']);
  }

}
