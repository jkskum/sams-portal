import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../service/user-services';

@Component({
  selector: 'app-user-create-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-create-edit.component.html',
  styleUrls: ['./user-create-edit.component.css']
})

export class UserCreateEditComponent implements OnInit {

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
    age: 0,
    gender: '',
    phone: '',
    country: '',
    city: '',
    institute: '',
    department: '',
    qualification: '',
    language: '',
    address: ''
  };

  firstName = '';
  lastName = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = parseInt(id, 10);
      this.loadUserData(this.userId);
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

  onSubmit(event: Event): void {
    event.preventDefault();
    
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
