import {
  trigger,
  transition,
  style,
  query,
  animate,
} from '@angular/animations';

export const fadeAnimation =
  trigger('fadeAnimation', [
    transition('* <=> *', [
      // Set a default  style for enter and leave
      query(':enter, :leave', [
        style({
          display: 'block',
          opacity: 0,
        }),
      ], {optional: true}),
      // Animate the new page in
      query(':enter', [
        animate('600ms ease',
          style({
            opacity: 1,
          })),
      ], {optional: true})
    ]),
  ]);
