import {Component, HostBinding, OnInit, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {ProfileService} from '../../../services/profile.service';
import {MatDialog} from '@angular/material/dialog';
import {InvitationService} from '../../../services/invitation.service';
import {Location} from '@angular/common';
import {Family} from '../../../models/family';
import {Profile} from '../../../models/profile';
import {FamilyService} from '../../../services/family.service';
import {TokenAuthService} from '../../../services/tokenAuth.service';
import {UploadFileService} from '../../../services/upload-file-service';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {animate, animateChild, query, stagger, style, transition, trigger} from '@angular/animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {InviteToFamilyDialogComponent} from '../../../components/dialogs/invite-to-family/invite-to-family-dialog';
import {DeleteFamilyImageDialogComponent} from '../../../components/dialogs/delete-family-image/delete-family-image-dialog';

export class FamilyImageDTO {
  description: String;
  data: String;
}
@Component({
  selector: 'app-family-gallery',
  templateUrl: './family-gallery.component.html',
  styleUrls: ['./family-gallery.component.scss'],
  providers: [UploadFileService, FamilyService],
  animations: [
    trigger('items', [
      transition(':enter', [
        style({ transform: 'translateX(300px) rotateZ(180deg) ', opacity: 0 }),  // initial
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'translateX(0px) rotateZ(0deg)', opacity: 1 }))  // final
      ])
    ]),
    trigger('list', [
      transition('0 <=> 1', [
        query('@items', stagger(300, animateChild()), {optional: true})
      ]),
    ])
  ]
})
export class FamilyGalleryComponent implements OnInit {
  myFamily;
  familyImages: any;
  public familyMembers: any;
  @ViewChild('imageInput') private imageInput: any;
  @ViewChild('imageLoader') private imageLoader: any;
  @ViewChild('imageExpanded') private imageExpanded: any;
  @ViewChild('descriptionInput') private descriptionInput: any;
  imageLoaded = false;
  displayedImages;
  displayedPages;
  imgUrl;
  croppedImage;
  expandedImageSrc;
  expandedImageDescription;
  exp = false;
  FAMILY_IMAGES_PER_PAGE = 4;
  public descriptionForm: FormGroup;


  constructor( private fb: FormBuilder, protected familyService: FamilyService, private dialog: MatDialog,
              protected toastr: ToastrService, protected translate: TranslateService,
              protected _location: Location, private authService: TokenAuthService, private uploadService: UploadFileService) {

  }

  ngOnInit(): void {
    this.myFamily = this.familyService.familyValue;
    this.getFamilyImages(true);
    this.descriptionForm = this.fb.group({
      description: ['', Validators.required],
    });
  }

  hasError(controlName) {
    return this.descriptionForm.get(controlName).hasError;
  }
  getFamilyImages(startFrom0: boolean) {
    this.familyService.getFamilyImages().subscribe(response => {
      if (response.status === 200) {
        this.familyImages = response.body;
        console.log(response.body);
        this.displayedPages = Math.ceil(this.familyImages.length / this.FAMILY_IMAGES_PER_PAGE);
        let startingPage = 0;
        if (startFrom0 === false) {
          startingPage = this.displayedPages - 1;
        }
        this.reloadData(startingPage);
      }
    });
  }

  upload() {
    const familyImageDTO = new FamilyImageDTO();
    familyImageDTO.data = this.croppedImage;
    familyImageDTO.description = this.descriptionInput.nativeElement.value;
    this.cancelChangingImage();
    this.uploadService.uploadFamilyImage(familyImageDTO).subscribe(response => {
      if (response.status === 200) {
        this.getFamilyImages(false);
      }
    });
  }
  selectFile(event) {
    if (event.target.files.length > 0) {
      this.imgUrl = event;
      this.imageLoaded = true;
      this.imageLoader.nativeElement.style.display = 'block';
    } else {
      this.cancelChangingImage();
    }
  }

  deleteImage(familyImageId: number) {
    const dialog = this.dialog.open(DeleteFamilyImageDialogComponent, {});
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.familyService.deleteFamilyImage(familyImageId).subscribe(response => {
          if (response.status === 200) {
            this.getFamilyImages(true);
          }
        });
      }
    });
  }
  imageCropped(event: ImageCroppedEvent) {
    event.width = 280;
    event.height = 200;
    this.croppedImage = event.base64;
  }

  cancelChangingImage() {
    this.imgUrl = '';
    this.imageLoaded = false;
    this.descriptionForm.controls['description'].setValue('');
    this.imageInput.clear(); // clear input
    this.imageInput.blur(); // lose focus
    this.imageLoader.nativeElement.style.display = 'none';
  }

  expandImage(src: any, description: any) {
    this.expandedImageSrc = src;
    this.expandedImageDescription = description;
    this.imageExpanded.nativeElement.style.opacity = '1';
    this.imageExpanded.nativeElement.style.height = '400px';
  }

  closeMe() {
    this.imageExpanded.nativeElement.style.opacity = '0';
    this.imageExpanded.nativeElement.style.height = '0px';
  }
  counter(i: number) {
    return new Array(i);
  }

  reloadData(page: number) {
    this.copyImages((page) * this.FAMILY_IMAGES_PER_PAGE);
  }

  copyImages(fromIndex: number) {
    this.displayedImages = new Array();
    for (let i = fromIndex, index = 0; i < fromIndex + this.FAMILY_IMAGES_PER_PAGE; i++, index++) {
      if (i < this.familyImages.length) {
        this.displayedImages[index] = this.familyImages[i];
      }
    }
    this.exp = !this.exp;
  }

}
