export class Location {
  constructor(formattedAddress: string, lat: number, lng: number, country: string) {
    this.formattedAddress = formattedAddress;
    this.lat = lat;
    this.lng = lng;
    this.country = country;
  }

  public formattedAddress: string;
  public lat: number;
  public lng: number;
  public country: string;
}
