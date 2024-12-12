import { Component, OnInit } from '@angular/core';
import { Person } from '../person';
import { PersonService } from '../person.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../message.service';
import { Modal } from 'bootstrap';

declare var window: any;

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './person.component.html',
  styleUrl: './person.component.css'
})

export class PersonComponent implements OnInit {
  persons: Person[] = [];
  selectedPerson: Person = this.reset();
  showAddForm: boolean = false;
  newPerson: Person = this.reset();
  isDriver: boolean = false;
  showEditForm: boolean = false;
  addPersonModal: any;
  backupPerson: Person = this.reset();
  editPersonModal: any;
  deletePersonModal: any;
  confirmationIdCard: string = '';

  constructor(
    private personService: PersonService,
    private messageService: MessageService
  ) {}

  getPersons(): void {
    this.personService.getPersons().subscribe((data: Person[]) => {
      this.persons = data;
    });
  }

  ngOnInit(): void {
    this.getPersons();
    const addPersonModalElement = document.getElementById('addPersonModal');
    if (addPersonModalElement) {
      this.addPersonModal = new Modal(addPersonModalElement);
    } else {
      console.error('addPersonModal element not found');
    }

    const editPersonModalElement = document.getElementById('editPersonModal');
    if (editPersonModalElement) {
      this.editPersonModal = new Modal(editPersonModalElement);
    } else {
      console.error('editPersonModal element not found');
    }

    const deletePersonModalElement = document.getElementById('deletePersonModal');
    if (deletePersonModalElement) {
      this.deletePersonModal = new Modal(deletePersonModalElement);
    } else {
      console.error('deletePersonModal element not found');
    }
  }

  toggleAdd(): void {
    this.newPerson = this.reset();
    this.showAddForm = !this.showAddForm;
    this.showEditForm = false;
  }

  reset(): Person {
    return { _id: '', name: '', idCard: '', status: '', __t: '', licence: '' };
  }

  cancel(): void {
    this.newPerson = this.reset();
    this.selectedPerson = this.reset();
    this.showAddForm = false;
    this.showEditForm = false;
  }

  openAddModal(): void {
    if (this.addPersonModal) {
      this.addPersonModal.show();
    } else {
      console.error('addPersonModal is undefined');
    }
  }

  confirmAdd(): void {
    this.addPersonModal.hide();
    this.personService.createPerson(this.newPerson).subscribe({
      next: () => {
        this.messageService.sendMessage({
          text: 'Person created successfully.',
          type: 'alert alert-success'
        });
        this.newPerson = this.reset();
        this.showEditForm = false;
        this.showAddForm = false;
        this.isDriver = false;
        this.getPersons();
      },
      error: (err) => {
        this.messageService.sendMessage({
          text: 'Error creating person: ' + err.error.error,
          type: 'alert alert-danger'
        });
      }
    });
  }

  toggleEdit(person: Person): void {
    this.backupPerson = { ...person };
    this.selectedPerson = { ...person };
    this.showEditForm = !this.showEditForm;
    this.showAddForm = false;
  }

  openEditModal(): void {
    this.editPersonModal.show();
  }

  confirmEdit(): void {
    this.editPersonModal.hide();
    this.personService.updatePerson(this.selectedPerson).subscribe({
      next: () => {
        this.messageService.sendMessage({
          text: 'Person updated successfully.',
          type: 'alert alert-success'
        });
        this.selectedPerson = this.reset();
        this.backupPerson = this.reset();
        this.showEditForm = false;
        this.showAddForm = false;
        this.getPersons();
      },
      error: (err) => {
        this.messageService.sendMessage({
          text: 'Error updating person: ' + err.error.error,
          type: 'alert alert-danger'
        });
      }
    });
  }

  openDeleteModal(person: Person): void {
    this.confirmationIdCard = '';
    this.selectedPerson = { ...person };
    this.deletePersonModal.show();
  }

  confirmDeleteModal(): void {
    if (this.confirmationIdCard === this.selectedPerson.idCard) {
      this.confirmDelete(this.selectedPerson);
    } else {
      this.messageService.sendMessage({
        text: 'IDs do not match. Canceling delete.',
        type: 'alert alert-danger'
      });
    }
    this.deletePersonModal.hide();
  }

  confirmDelete(person: Person): void {
    this.personService.deletePerson(person).subscribe({
      next: () => {
        this.messageService.sendMessage({
          text: 'Person deleted successfully.',
          type: 'alert alert-success'
        });
        this.getPersons();
      },
      error: (err) => {
        this.messageService.sendMessage({
          text: 'Error deleting person: ' + err.error.error,
          type: 'alert alert-danger'
        });
      }
    });
  }
}
