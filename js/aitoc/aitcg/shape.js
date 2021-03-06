
/**
 * Product:     Custom Product Preview
 * Package:     Aitoc_Aitcg_3.0.1_1.0.0_520274
 * Purchase ID: n/a
 * Generated:   2013-03-05 20:52:02
 * File path:   js/aitoc/aitcg/shape.js
 * Copyright:   (c) 2013 AITOC, Inc.
 */
VectorEditor.prototype.deleteSelection = function(){
  while(this.selected.length > 0){
    this.deleteShape(this.selected[0])
  }
}

VectorEditor.prototype.deleteShape = function(shape,nofire){
  if(!nofire){if(this.fire("delete",shape)===false)return;}

  if(shape && shape.node && shape.node.parentNode){
    shape.remove()
  }
  for(var i = 0; i < this.trackers.length; i++){
    if(this.trackers[i].shape == shape){
      this.removeTracker(this.trackers[i]);
    }
  }
  for(var i = 0; i < this.shapes.length; i++){
    if(this.shapes[i] == shape){
      this.shapes.splice(i, 1)
    }
  }
  for(var i = 0; i < this.selected.length; i++){
    if(this.selected[i] == shape){
      this.selected.splice(i, 1)
    }
  }
  //should remove references, but whatever
}

VectorEditor.prototype.deleteAll = function(){
  this.fire("clear2")
  this.draw.clear()
  this.shapes = []
  this.trackers = []
}

VectorEditor.prototype.clearShapes = function(){
  this.fire("clear")
  while(this.shapes.length > 0){
    this.deleteShape(this.shapes[0],true) //nofire
  }
}

VectorEditor.prototype.generateUUID = function(){
  var uuid = "", d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < 4/*16*/; i++){
    uuid += d.charAt(Math.floor(Math.random()*(i?d.length:(d.length-10))));
  }
  return uuid;
}

VectorEditor.prototype.getShapeById = function(v){
  for(var i=this.shapes.length;i--&&this.shapes[i].id!=v;);
  return this.shapes[i]
}

VectorEditor.prototype.addShape = function(shape,no_select, no_fire){
  if(!no_fire)this.fire("addshape",shape,no_select);
  shape.node.shape_object = shape
  if(!no_select){
    this.selected = [shape]
  }
  this.shapes.push(shape)
  if(!no_fire)this.fire("addedshape",shape,no_select);
}

VectorEditor.prototype.rectsIntersect = function(r1, r2) {
  return r2.x < (r1.x+r1.width) && 
          (r2.x+r2.width) > r1.x &&
          r2.y < (r1.y+r1.height) &&
          (r2.y+r2.height) > r1.y;
}

VectorEditor.prototype.drawGrid = function(){
  this.draw.drawGrid(0, 0, 480, 272, 10, 10, "blue").toBack()
}

VectorEditor.prototype.move = function(shape, x, y){
  //HACKITY HACK HACK
  //var rot = null;
  //if(shape._ && shape._.rt){
  //  rot = shape._.rt.deg
  //}
  
  //<here's the part that isn't a hack>
  shape.translate(x,y)
  //</end non-hack>
  
  //HACKITY HACK HACK
  //if(rot){
  //  shape.rotate(rot,true)//absolutelyness
  //}
  //if(shape._ && shape._.rt){
  //  shape.rotate(shape._.rt.deg, true)
  //}
}


VectorEditor.prototype.scale = function(shape, corner, x, y){
  var xp = 0, yp = 0
  var box = shape.getBBox()
  switch(corner){
    case "tr":
      xp = box.x
      yp = box.y + box.height
      break;
    case "bl":
      xp = box.x + box.width
      yp = box.y
      break;
    case "tl":
      xp = box.x + box.width;
      yp = box.y + box.height;
    break;
    case "br":
      xp = box.x
      yp = box.y
    break;
  }
  shape.scale(x, y, xp, yp)
}

VectorEditor.prototype.fixText = function(str){
  return window.Ax?Ax.textfix(str):str;
}

VectorEditor.prototype.resize = function(object, width, height, x, y){
  if(object.type == "rect" || object.type == "image"){
    if(Raphael.type =='VML' && object.attrs.preserveAspectRatio !=='none')
    {
        var multiplier = 1;
        var dH = height-object.H;
        var dW = width-object.W;
        var origDiagonal = Math.sqrt(Math.pow(object.H,2)+Math.pow(object.W,2));
        var delta = Math.sqrt(Math.pow(dH,2)+Math.pow(dW,2));
        switch(true)
        {
            case((dH + dW)>0):
                multiplier = (origDiagonal + delta)/origDiagonal;
                break;
            case((dH + dW)==0):
                multiplier = 1;
                break;
            case((dH + dW)<0):
                multiplier = (origDiagonal - delta)/origDiagonal;
                break;
        }

        if(width > 0)
        {
            object.attr("width", object.W*multiplier);
        }
        else
        {
            object.attr("x", (x?x:object.attr("x"))+object.W*multiplier);
            object.attr("width", Math.abs(object.W*multiplier)); 
        }
        if(height > 0){
            object.attr("height", object.H*multiplier);
        }
        else
        {
            object.attr("y", (y?y:object.attr("y"))+object.H*multiplier);
            object.attr("height", Math.abs(object.H*multiplier));
        }
    }
    else
    {
        if(width > 0){
            object.attr("width", width)
        }else{
            object.attr("x", (x?x:object.attr("x"))+width)
            object.attr("width", Math.abs(width)) 
        }
        if(height > 0){
            object.attr("height", height)
        }else{
            object.attr("y", (y?y:object.attr("y"))+height)
            object.attr("height", Math.abs(height)) 
        }
    }
  }else if(object.type == "ellipse"){
    if(width > 0){
      object.attr("rx", width)
    }else{
      object.attr("x", (x?x:object.attr("x"))+width)
      object.attr("rx", Math.abs(width)) 
    }
    if(height > 0){
      object.attr("ry", height)
    }else{
      object.attr("y", (y?y:object.attr("y"))+height)
      object.attr("ry", Math.abs(height)) 
    }
  }else if(object.type == "text"){
    object.attr("font-size", Math.abs(width))
    //object.node.style.fontSize = null;
  }
}