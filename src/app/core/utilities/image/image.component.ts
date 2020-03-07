import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  imageLoader = true;

  @Input()
  public image;

  @Input()
  public class;

  constructor() {
  }

  ngOnInit() {
  }

}
