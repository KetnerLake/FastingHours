import Dexie from "dexie";

export class Database {
  constructor() {
    this._db = new Dexie( 'FastingHours' );
    this._db.version( 10 ).stores( {
      history: 'id, start'
    } );    
  }

  browse() {
    return this._db.history.toArray();
  }

  browseByEnd() {
    return this._db.history.toArray().then( ( data ) => {
      const empties = data.filter( ( value ) => value.end === null ? true : false );
      return empties[0];
    } );
  }

  read( id ) {
    return this._db.history.get( {id} );
  }

  add( item ) {
    item.id = crypto.randomUUID();
    return this._db.history.add( item ).then( () => this._db.history.get( {id: item.id} ) );
  }

  edit( item ) {
    return this._db.history.put( item ).then( () => this._db.history.get( {id: item.id} ) );
  }

  delete( id ) {
    return this._db.delete( id );
  }
}
