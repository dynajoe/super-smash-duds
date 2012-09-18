var Extends = function(child, parent) { 
   
   for (var key in parent) { 
      if (Object.hasOwnProperty.call(parent, key)) 
      child[key] = parent[key]; 
   } 

   function ctor() { this.constructor = child; } 
   ctor.prototype = parent.prototype; 
   child.prototype = new ctor(); 
   child._super = parent.prototype; 

   return child; 

};
