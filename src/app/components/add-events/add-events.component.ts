import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { ReactiveFormsModule } from '@angular/forms';  

@Component({
  selector: 'app-add-event',
  templateUrl: './add-events.component.html',
  styleUrls: ['./add-events.component.scss'],
  standalone: true,  
  imports: [
    CommonModule,   
    ReactiveFormsModule,  
  ],
})
export class AddEventComponent implements OnInit {

  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private db: DatabaseService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      Nombre: ['', Validators.required],
      Descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      cantidad: ['', [Validators.required, Validators.min(0)]],
      descuento: [''],
      imagen: ['']
    });
  }

  ngOnInit(): void {}

  addEvent() {
    if (this.eventForm.valid) {
      const newEvent = this.eventForm.value;
      this.db.addFirestoreDocument('consertevents', newEvent).then(() => {
        alert('Evento añadido exitosamente');
        this.router.navigate(['/admin-events']);  // Redirigir a la página de administración de eventos
      }).catch(error => {
        console.error('Error añadiendo el evento: ', error);
        alert('Hubo un error al añadir el evento');
      });
    } else {
      alert('Formulario inválido. Verifica los datos.');
    }
  }
}