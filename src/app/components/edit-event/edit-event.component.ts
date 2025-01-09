import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';  
import { ReactiveFormsModule } from '@angular/forms';  
import { Firestore, doc, docData } from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
  standalone: true,  
  imports: [
    CommonModule,   
    ReactiveFormsModule,  
  ],
})
export class EditEventComponent implements OnInit {

  id: string | null = null;
  eventoForm: FormGroup;
  evento: any = {};  // Agrega esta propiedad para almacenar los datos del evento

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public auth: AuthService,
    private cartService: CarritoService,
    private db: DatabaseService // Inyecta el servicio aquí
  ) {
    this.eventoForm = this.fb.group({
      Nombre: ['', Validators.required],
      Descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      cantidad: ['', [Validators.required, Validators.min(0)]],
      descuento: [''],
      imagen: ['']
    });
  }

  ngOnInit() {
    // Obtener el ID del evento desde la URL
    this.id = this.route.snapshot.paramMap.get('id');

    // Si tenemos un ID, obtener los datos del evento
    if (this.id) {
      this.db.getDocumentById('consertevents', this.id).subscribe({
        next: (evento: any) => {
          this.evento = evento;  // Guardar los datos del evento en la propiedad evento
          // Actualizar el formulario con los datos del evento recuperados
          this.eventoForm.patchValue({
            Nombre: evento.Nombre,
            Descripcion: evento.Descripcion,
            precio: evento.precio,
            cantidad: evento.cantidad,
            descuento: evento.descuento,
            imagen: evento.imagen
          });
        },
        error: (error) => {
          console.error('Error obteniendo los datos del evento: ', error);
          alert('Hubo un error al obtener los datos del evento');
        }
      });
    }
  }

  saveEvent() {
    if (this.eventoForm.valid && this.id) {
      // Obtener los valores del formulario
      const updatedEvent = this.eventoForm.value;

      // Actualizar los datos del evento en Firebase
      this.db.updateFirestoreDocument('consertevents', this.id, updatedEvent).then(() => {
        alert('Evento actualizado exitosamente');
      }).catch(error => {
        console.error('Error actualizando el evento: ', error);
        alert('Hubo un error al actualizar el evento');
      });
    } else {
      alert('Formulario inválido. Verifica los datos.');
    }
  }
  deleteEvent() {
    if (this.id) {
      this.db.deleteFirestoreDocument('consertevents', this.id).then(() => {
        alert('Evento eliminado exitosamente');
      }).catch(error => {
        console.error('Error eliminando el evento: ', error);
        alert('Hubo un error al eliminar el evento');
      });
    } else {
      alert('No se pudo encontrar el ID del evento');
    }
  }
}