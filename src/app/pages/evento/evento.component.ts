import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute, Route } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-evento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evento.component.html',
  styleUrl: './evento.component.scss'
})
export class EventoComponent {

  id: any = null;
  evento: any = null;
  selectedTickets: number = 1;
  

  constructor(
    public http: HttpClient,
    public db: DatabaseService,
    public auth: AuthService,
    public route: ActivatedRoute,
    public firestore: Firestore,
    private cartService: CarritoService,

  ) {

    this.id = this.route.snapshot.paramMap.get('id');

  }

  ngOnInit(): void {
    this.db.getDocumentById('consertevents', this.id)
    .subscribe((res: any) => {
      this.evento = res;
    });

  }
  addToCart(): void {
    // Verificar si 'data' está disponible antes de intentar acceder a sus propiedades
    if (this.evento) {
      // Asegurarse de que la cantidad seleccionada no exceda la cantidad disponible
      if (this.selectedTickets > this.evento.cantidad) {
        alert("No hay suficientes boletos disponibles");
        return;
      }

      const ticketData = {
        eventId: this.id,
        eventName: this.evento.Nombre,
        ticketPrice: this.evento.precio,
        ticketQuantity: this.selectedTickets,
        totalPrice: this.selectedTickets * this.evento.precio
      };

      // Añadir los datos del ticket al carrito
      this.cartService.addToCart(ticketData);
    } else {
      alert("Error al cargar los datos del evento");
    }
  }
}
