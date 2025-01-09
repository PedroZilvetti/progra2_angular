import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { CardComponent } from '../../components/card/card.component';
import { BtnComponent } from '../../components/btn/btn.component';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router'; // Para redireccionar
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-events',
  standalone: true,  // Componente standalone
  imports: [
    CommonModule,
    CardComponent,
    BtnComponent,
    RouterLink  // Asegúrate de incluir RouterLink para navegación
  ],
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.scss']
})
export class AdminEventsComponent implements OnInit {

  id: string | null = null;
  eventoForm: FormGroup;
  evento: any = {};  // Esta propiedad se usa para almacenar el evento a editar
  events: any[] = [];
  filteredEvents: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private fb: FormBuilder,
    private db: DatabaseService,
    private router: Router // Inyectar Router para navegación
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
    this.loadData();
  }

  loadData() {
    this.db.fetchFirestoreCollection('consertevents')
      .subscribe((res: any[]) => {
        this.events = res || [];
        this.filteredEvents = res;
      });
  }

  filterByTag(tag: string) {
    if (tag === '') {
      this.filteredEvents = this.events;
    } else {
      this.filteredEvents = this.events.filter(event =>
        event.tags && event.tags.includes(tag) // Filtra por etiquetas
      );
    }
  }

  // Redirigir a la página de edición
  editEvent(eventId: string) {
    this.router.navigate(['/edit-event', eventId]);  // Cambia 'edit-event' por la ruta correcta del componente de edición
  }

  saveEvent() {
    if (this.eventoForm.valid && this.id) {
      const updatedEvent = this.eventoForm.value;
      this.db.updateFirestoreDocument('eventos', this.id, updatedEvent).then(() => {
        alert('Evento actualizado exitosamente');
      }).catch(error => {
        console.error('Error actualizando el evento: ', error);
        alert('Hubo un error al actualizar el evento');
      });
    } else {
      alert('Formulario inválido. Verifica los datos.');
    }
  }
  addEvent() {
      const newEvent = this.eventoForm.value;
      this.db.addFirestoreDocument('consertevents', newEvent).then(() => {
        this.router.navigate(['/add-events']);  // Redirigir a la página de administración de eventos
      }).catch(error => {
        console.error('Error añadiendo el evento: ', error);
        alert('Hubo un error al añadir el evento');
      });

  }
}
