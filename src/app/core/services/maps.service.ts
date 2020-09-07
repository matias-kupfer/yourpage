import {Injectable, NgZone} from '@angular/core';
import {MapsAPILoader} from '@agm/core';
import {Location} from '../../class/location';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  private geoCoder;

  constructor(
    private mapsAPILoader: MapsAPILoader) {


  }

  findLocation(placeId: string): Promise<Location> {
    return new Promise(resolve => {
      this.mapsAPILoader.load().then(() => {
        this.geoCoder = new google.maps.Geocoder();
        this.geoCoder.geocode({placeId}, (results) => {
          if (results.length) {
            results[0].address_components.forEach(component => {
              component.types.forEach((type) => {
                if (type === 'country') {
                  resolve(new Location(results[0].formatted_address, results[0].geometry.location.lat(), results[0].geometry.location.lng(), (component.long_name)));
                }
              });
            });
          }
        });
      });
    });
  }
}
