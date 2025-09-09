export class CandidateInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  currentRole: string;

  constructor(
    name: string,
    email: string,
    phone: string,
    location: string,
    experience: string,
    currentRole: string
  ) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.location = location;
    this.experience = experience;
    this.currentRole = currentRole;
  }
}
