
// Inital Vars //

var canvas, ctx,
    canvasWidth = 400,
    canvasHeight = 300,
    groundColor = "rgb(41,149,120)",
    fogColor = "rgb(116,141,146)",
    bgGradient,
    treeMinWidth = 20,
    treeMaxWidth = 30,
    tr = 93, tg = 67, tb = 20,
    i;

// General math functions //

function floor(number) {
  return Math.floor(number);
}

function random(range) {
  return floor(Math.random()*range);
}

function getRGB(r, g, b) {
  return "rgb("+floor(r)+","+floor(g)+","+floor(b)+")";
}

// Merge Sort //

function mergeTrees(left, right) {
  var result  = [],
      il      = 0,
      ir      = 0;

  while (il < left.length && ir < right.length){
    if (left[il].dist > right[ir].dist){
      result.push(left[il++]);
    } else {
      result.push(right[ir++]);
    }
  }
  return result.concat(left.slice(il)).concat(right.slice(ir));
}

function mergeSort(items, attr){

  if (items.length < 2) {
    return items;
  }

  var middle = floor(items.length / 2),
      left   = items.slice(0, middle),
      right  = items.slice(middle),
      params = mergeTrees(mergeSort(left), mergeSort(right));

  // Add the arguments to replace everything between 0 and last item in the array
  params.unshift(0, items.length);
  items.splice.apply(items, params);
  return items;
}

// Canvas Functions //

function resetCanvas(ctx) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  bgGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  bgGradient.addColorStop(0.5, fogColor);
  bgGradient.addColorStop(1, groundColor);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}


// Forest //

var Forest = {
  trees: [],

  populate: function(num) {
    for (i=0; i<num; i++) {
      this.trees.push(new Tree.random());
    }
  },

  order: function() {
    mergeSort(this.trees);
  },

  draw: function(ctx) {
    for (i=0; i<this.trees.length; i++) {
      this.trees[i].draw(ctx);
    }
  },

  create: function(ctx, num) {
    this.populate(num);
    this.order();
    this.draw(ctx);
  },

  clear: function() {
    this.trees = [];
  }
}

// Tree Functions //

function Tree(x, y, w) {
  this.x = x;
  this.y = floor(y/8);
  this.dist = y/canvasHeight;
  this.setDistance("w", w);
  this.setDistance("r", tr);
  this.setDistance("g", tg);
  this.setDistance("b", tb);
  this.color = getRGB(this.r, this.g, this.b);
}

Tree.random = function() {
  return new Tree(random(canvasWidth), random(canvasHeight), treeMinWidth+random(treeMaxWidth));
};

Tree.prototype = {
  setDistance: function(attr, val) {
    this[attr] = val-val*this.dist;
  },
  draw: function(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x-20, 0, this.w, canvasHeight-this.y);
  }
}

// Run It //

window.onload = function() {
  canvas = document.getElementById("forest");
  ctx = canvas.getContext("2d");

  resetCanvas(ctx);
  Forest.create(ctx, 20);

  canvas.addEventListener("click", function() {
    resetCanvas(ctx);
    Forest.clear();
    Forest.create(ctx, 20);
  });
};