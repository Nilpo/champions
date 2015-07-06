var CoC = CoC || {};
CoC.model = CoC.model || {};
CoC.model.Champion = Backbone.Model.extend({
	defaults: {
    uid: "champion",
    stars:2,
		name: 'Champion',
		typeId: "mutant",
    awakened: 0,
    rank: 1,
    level: 1,
    pi: 0,
    quest: false
  },
  
  fid:function(){
    if(this._fid === undefined){
      this._fid = this.get("uid")+"_"+this.get("stars");
    }
    return this._fid;
  },
  
  portrait:function(){
    if(this._portrait === undefined){
      this._portrait = 'images/champions/portrait_'+this.get('uid')+'.png'
    }
    return this._portrait;
  },
  
  image:function(){
    if(this._image === undefined){
      this._image = 'images/champions/fullsize_'+this.get('uid')+'.png'
    }
    return this._image;
  },
  
  type:function(){
    if(this._type === undefined){
      this._type = CoC.data.types.findWhere({ uid:this.get("typeId") });
    }
    return this._type;
  },
  
  //dirty way to migrate to new data model using uid/stars as given
  update:function(other){
    var other = CoC.data.champions.findWhere({ uid:this.get("uid"), stars:this.get("stars") });
    if(!other)
      return false;
    this.set("name", other.get("name"));
    this.set("typeId", other.get("typeId"));
    return true;
  }
});