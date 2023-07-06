using { managed } from '@sap/cds/common';
namespace de.quadrio.recap;

entity Books : managed {
  key ID : Integer;
  @mandatory author : Association to Authors;
  stock  : Integer;
  price  : Decimal;
}

entity Authors : managed {
  key ID : Integer;
  @mandatory name   : String(111);
  dateOfBirth  : Date;
  dateOfDeath  : Date;
  placeOfBirth : String;
  placeOfDeath : String;
  books  : Association to many Books on books.author = $self;
}