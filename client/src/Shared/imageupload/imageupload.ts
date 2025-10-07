import { Component, input, Input, output, Output, signal } from '@angular/core';

@Component({
  selector: 'app-imageupload',
  imports: [],
  templateUrl: './imageupload.html',
  styleUrl: './imageupload.css'
})
export class Imageupload {
  protected imageSource = signal<string | ArrayBuffer | null | undefined >(null);
  protected isDragging = false;
  private fileToUpload : File | null = null;
  uploadFile = output<File>();
  loading = input<boolean>(false);

  onDragOver(event: DragEvent){
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }
  onDragLeave(event: DragEvent){
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent){
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if(event.dataTransfer?.files.length){
      const file = event.dataTransfer.files[0];
      this.previewImage(file);
      this.fileToUpload = file;
    }
  }

  onCancel(){
    this.fileToUpload = null;
    this.imageSource.set(null);
  }

  onUploadFile(){
    if(this.fileToUpload){
      this.uploadFile.emit(this.fileToUpload);
    }
  }

  private previewImage(file: File){
    const reader = new FileReader();
    reader.onload = (e) => this.imageSource.set(e.target?.result);
    reader.readAsDataURL(file);
  }
}
