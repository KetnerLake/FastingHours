import Dexie from "dexie";

export class Database {
  constructor() {
    this._db = new Dexie( 'FastingHours' );
    this._db.version( 20 ).stores( {
      history: 'id, started',
      hunger: 'id, created',
      water: 'id, created'
    } );    
  }

  browseHistory() {
    return this._db.history.toArray();
  }

  browseHistoryByEnd() {
    return this._db.history.toArray().then( ( data ) => {
      const empties = data.filter( ( value ) => value.ended === null ? true : false );
      return empties[0];
    } );
  }

  readHistory( id ) {
    return this._db.history.get( {id} );
  }

  editHistory( item ) {
    const clone = $state.snapshot( item );
    clone.updated = new Date();
    return this._db.history.put( clone ).then( () => this._db.history.get( {id: item.id} ) );
  }  

  addHistory() {
    const item = {
      id: crypto.randomUUID(),
      type: 'history',
      created: new Date(),
      updated: new Date(),
      started: new Date(),
      ended: null,
      notes: null
    };
    return this._db.history.add( item ).then( () => this._db.history.get( {id: item.id} ) );
  }

  deleteHistory( id ) {
    return this._db.history.delete( id );
  }

  browseHunger( recent = false ) {
    return this._db.hunger.toArray().then( ( data ) => {
      if( recent ) {
        data.sort( ( a, b ) => {
          if( a.created.getTime() < b.created.getTime() ) return 1;
          if( a.created.getTime() > b.created.getTime() ) return -1;
          return 0;          
        } );

        return data.length === 0 ? null : data[0];
      }
      
      return data;
    } );
  }

  readHunger( id ) {
    return this._db.hunger.get( {id} );
  }

  editHunger( item ) {
    const clone = $state.snapshot( item );    
    clone.updated = new Date();
    return this._db.hunger.put( clone ).then( () => this._db.hunger.get( {id: item.id} ) );
  }  

  addHunger( level = 5 ) {
    const item = {
      id: crypto.randomUUID(),
      type: 'hunger',
      created: new Date(),
      updated: new Date(),
      level
    };
    return this._db.hunger.add( item ).then( () => this._db.hunger.get( {id: item.id} ) );
  }  

  deleteHunger( id ) {
    return this._db.hunger.delete( id );
  }    

  browseWater( filter = false ) {
    return this._db.water.toArray().then( ( data ) => {    
      if( filter ) {
        const start = new Date();
        start.setHours( 0 );
        start.setMinutes( 0 );
        start.setSeconds( 0 );
        start.setMilliseconds( 0 );

        const end = new Date( start.getTime() );
        end.setDate( end.getDate() + 1 );

        return data.filter( ( value ) => value.created.getTime() > start.getTime() && value.created.getTime() < end.getTime() ? true : false );
      } else {
        return data;
      }
    } );
  }

  readWater( id ) {
    return this._db.water.get( {id} );
  }  

  editWater( item ) {
    const clone = $state.snapshot( item );    
    clone.updated = new Date();
    return this._db.water.put( clone ).then( () => this._db.water.get( {id: item.id} ) );
  }
  
  addWater( volume ) {
    const item = {
      id: crypto.randomUUID(),
      type: 'water',
      created: new Date(),
      updated: new Date(),
      volume
    };
    const id = crypto.randomUUID();
    return this._db.water.add( item ).then( () => this._db.water.get( {id: item.id} ) );      
  }  

  deleteWater( id ) {
    return this._db.water.delete( id );
  }  
}
