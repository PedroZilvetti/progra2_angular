import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [NgFor, RouterLink, CartItemComponent],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {
  title: string = 'Carrito de Compras';
  cartData: any[] = [];
  totalTickets: number = 0;
  totalPrice: number = 0;
  discountPrice: number = 0;

  constructor(public cartService: CarritoService) {}

  ngOnInit(): void {
    this.cartData = this.cartService.getCartItems();
    this.calculateTotals();
  }

  calculateTotals(): void {
    // Calcular el total de tickets
    this.totalTickets = this.cartData.reduce((sum, item) => sum + item.ticketQuantity, 0);
  
    // Calcular el precio total considerando el descuento en porcentaje
    this.totalPrice = this.cartData.reduce((sum, item) => {
      // Si hay descuento, calcular el precio reducido, de lo contrario usar el precio original
      const price = (item.descuento !== undefined && item.descuento >= 0) 
        ? item.totalPrice * (1 - item.descuento / 100) 
        : item.totalPrice;
        
      return sum + (price * item.ticketQuantity);
    }, 0);
  
    // Guardar los totales en el LocalStorage
    this.saveTotal();
  }
  removeItem(item: any): void {
    this.cartService.removeItem(item);
    this.cartData = this.cartService.getCartItems();
    this.calculateTotals();
  }

  saveTotal(): void {
    localStorage.setItem('totalPrice', JSON.stringify(this.totalPrice));
    localStorage.setItem('discountPrice', JSON.stringify(this.discountPrice));
    localStorage.setItem('totalTickets', JSON.stringify(this.totalTickets));
  }
}