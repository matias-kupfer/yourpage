import {
  trigger,
  transition,
  style,
  query,
  group,
  animateChild,
  animate,
  keyframes,
} from '@angular/animations';

export const fadeAnimation =
  trigger('fadeAnimation', [
    transition('* <=> *', [
      // query('@inner', [animateChild()], {optional: true}),
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
// query('@inner', [animateChild()], {optional: true}),
// {optional: true}
