import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc, collection, addDoc, getDocs, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogued = false;
  profile: any;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    public db: DatabaseService,
    public router: Router
  ) {
    this.verifyIsLogued();
    let storedProfile: any = localStorage.getItem('profile');
    if (storedProfile) {
      this.profile = JSON.parse(storedProfile);
    }
    let storedUser: any = localStorage.getItem('user');
    if (storedUser) {
      let user = JSON.parse(storedUser);
      this.getProfile(user?.uid);
    }
  }

  async registerUser(email: string, password: string, additionalData: { name: string; phone: string; username: string }) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const userId = userCredential.user.uid;

      const userDocRef = doc(this.firestore, `users/${userId}`);
      await setDoc(userDocRef, { ...additionalData, email });
      this.router.navigateByUrl('/login');
      console.log('Usuario registrado y documento creado en Firestore');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      localStorage.setItem('user', JSON.stringify(userCredential.user));
      console.log('Usuario autenticado:', userCredential.user);
      this.getProfile(userCredential.user.uid);
      this.router.navigateByUrl('/profile');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }

  verifyIsLogued() {
    let user = localStorage.getItem('user');
    this.isLogued = user ? true : false;
    return user ? true : false;
  }

  getProfile(uid: any) {
    this.db.getDocumentById('users', uid).subscribe(
      (res: any) => {
        console.log('Perfil desde Firebase:', res);
        localStorage.setItem('profile', JSON.stringify(res));
        this.profile = res;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  // Función para añadir un formulario a Firestore
  async addForm(formData: any) {
    try {
      const formsCollection = collection(this.firestore, 'forms');
      const docRef = await addDoc(formsCollection, formData);
      console.log('Formulario añadido con ID:', docRef.id);
    } catch (error) {
      console.error('Error al añadir formulario:', error);
    }
  }

  // Función para leer todos los formularios desde Firestore
  async getForms() {
    try {
      const formsCollection = collection(this.firestore, 'forms');
      const querySnapshot = await getDocs(formsCollection);
      const forms = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Formularios cargados:', forms);
      return forms;
    } catch (error) {
      console.error('Error al obtener formularios:', error);
      return [];
    }
  }

  // Función para editar un formulario en Firestore
  async updateForm(formId: string, updatedData: any) {
    try {
      const formDoc = doc(this.firestore, `forms/${formId}`);
      await updateDoc(formDoc, updatedData);
      console.log('Formulario actualizado con ID:', formId);
    } catch (error) {
      console.error('Error al actualizar formulario:', error);
    }
  }

  // Función para borrar un formulario en Firestore
  async deleteForm(formId: string) {
    try {
      const formDoc = doc(this.firestore, `forms/${formId}`);
      await deleteDoc(formDoc);
      console.log('Formulario borrado con ID:', formId);
    } catch (error) {
      console.error('Error al borrar formulario:', error);
    }
  }
}
