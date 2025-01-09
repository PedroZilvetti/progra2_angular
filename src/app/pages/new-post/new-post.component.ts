import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [
    ReactiveFormsModule, NgIf
  ],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss'
})
export class NewPostComponent {

  id: any;
  formulario!: FormGroup;
  post: any;
  constructor(
    public auth: AuthService,
    public db: DatabaseService,
    private fb: FormBuilder,
    public activatedRoute: ActivatedRoute
  ) {

    this.id = this.activatedRoute.snapshot.paramMap.get('post');
    this.formulario = fb.group({
      image: ['/posts/', []],
      content: ['', [Validators.required]],
    })
    if (this.id) {
      console.log('posts', 'id', this.id)
      this.db.getDocumentById('posts', this.id)
        .subscribe((res: any) => {
          this.post = res;
          console.log('post recuperado', res);
          this.formulario = fb.group({
            image: [res.image, []],
            content: [res.content, []],
          })
        })
    }
    else {
      this.formulario = fb.group({
        image: ['/posts/', []],
        content: ['', [Validators.required]],
      })
    }
  }


  async storePost() {
    if (this.formulario.valid) {
      ///// para almacenar
      console.log('datos capturados', this.formulario.value);
      const { image, content } = this.formulario.value;
      //auth.profile?.id
      if (this.id) {
        let newPost = await this.db.updateFirestoreDocument('posts', this.id, {
          image: image,
          content: content,
        });
        alert('Post actualizado');
      }
      else
      {
        let newPost = await this.db.addFirestoreDocument('posts',
          {
            userId: this.auth.profile?.id,
            image: image,
            content: content,
            userTags: [],
            share: [],
            likes: [],
            comentarios: []
          });
        alert('nuevo post creado');
      }
    }
    else {
      alert('Verifique y complete los datos')
    }
  }




}
