using { de.quadrio.recap as my } from '../db/schema';
service AdminService @(path:'/admin') {
  entity Books as projection on my.Books;
  entity Authors as projection on my.Authors;
}