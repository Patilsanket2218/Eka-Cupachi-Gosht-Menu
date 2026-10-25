// Spelling-corrected data from Menu.xlsx. Making costs are left out on purpose: this page is for customers.
var MENU = [
 {id:"chai",title:"Chai",items:[
  ["Chai",15],["Elaichi Chai",15],["Adrak Chai",15],["Masala Chai",20],["Lemon Tea",20],
  ["Black Tea",20],["Jaggery Tea",25],["Chai with Edible Cup",15]]},
 {id:"coffee",title:"Coffee",items:[
  ["Espresso",45],["Americano",55],["Latte",65],["Cappuccino",65],["Coffee",60],
  ["Cold Coffee",80],["Cold Coffee with Ice Cream",100],["Iced Americano",70],["Iced Latte",80],
  ["Iced Cappuccino",80],["Hot Chocolate",100],["Hot Chocolate with Edible Cup",120],
  ["Hot Chocolate with Chocolate Edible Cup",145],["Espresso Bomb",80],["Sunset Orange Espresso",120],
  ["Sunrise Orange Espresso",120],["Affogato",90],["Chocolate Affogato",110],["Pistachio Affogato",120],
  ["Ube Matcha",150],["Iced Matcha",150]]},
 {id:"bun-maska",title:"Bun Maska",items:[
  ["Bun Maska",40],["Sugar Bun Maska",45],["Jam Bun Maska",50],["Nutella Bun Maska",70],["Cheese Bun Maska",60]]},
 {id:"cookies",title:"Cookies",items:[
  ["Classic Chocolate Chunk",120],["Double Chocolate Almond Chunk",130],["Chunky Espresso Walnut",150],
  ["Coconut Crunch",170],["Cookie Jar",120]]},
 {id:"smoothies",title:"Smoothies",items:[
  ["Banana Smoothie",200],["Apple Smoothie",270],["Chocolate Smoothie",250]]},
 {id:"maggi",title:"Maggi",items:[
  ["Maggi",45],["Cheese Maggi",65],["Veggie Maggi",60],["Veg Soup Maggi",65]]},
 {id:"fries",title:"Fries",items:[
  ["Salted Fries",60],["Peri Peri Fries",75],["Cheesy Fries",90],["Salted Crinkle Fries",70],
  ["Peri Peri Crinkle Fries",80],["Cheesy Crinkle Fries",100],["Salted Popcorn Fries",90],
  ["Peri Peri Popcorn Fries",100],["Cheesy Popcorn Fries",120]]},
 {id:"burgers",title:"Burgers",items:[
  ["Aloo Tikki Burger",70],["Cheese Aloo Tikki Burger",90],["Veggie Burger",90],["Cheese Veggie Burger",110],
  ["Mini Aloo Tikki Burger",60,"4 pcs"],["Mini Cheese Aloo Tikki Burger",75,"4 pcs"],
  ["Mini Veggie Burger",80,"4 pcs"],["Mini Cheese Veggie Burger",90,"4 pcs"],["Korean Burger",150]]},
 {id:"sandwiches",title:"Sandwiches",items:[
  ["Sandwich",60],["Toast Sandwich",75],["Cheese Toast Sandwich",100],["Veggie Mayonnaise Sandwich",90],
  ["Masala Toast Sandwich",90],["Cheese Masala Toast Sandwich",110],["Paneer Tikka Sandwich",150],
  ["Cheese Chilli Toast",100],["Cheese Garlic Bread",100]]}
];

var menuEl = document.getElementById("menu");
var chipsEl = document.getElementById("chips");
var qEl = document.getElementById("q");

function esc(s){return s.replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function hl(name,q){
  var safe = esc(name);
  if(!q) return safe;
  var i = name.toLowerCase().indexOf(q);
  if(i<0) return safe;
  return esc(name.slice(0,i))+"<mark>"+esc(name.slice(i,i+q.length))+"</mark>"+esc(name.slice(i+q.length));
}

function render(q){
  q = (q||"").trim().toLowerCase();
  var html = "", chips = "", shown = 0;
  MENU.forEach(function(cat){
    var items = cat.items.filter(function(it){
      return !q || it[0].toLowerCase().indexOf(q)>-1 || cat.title.toLowerCase().indexOf(q)>-1;
    });
    if(!items.length) return;
    shown += items.length;
    chips += '<a href="#'+cat.id+'" data-id="'+cat.id+'">'+esc(cat.title)+'</a>';
    html += '<section id="'+cat.id+'"><div class="sec-head"><h2>'+esc(cat.title)+'</h2><span>'+items.length+(items.length===1?' item':' items')+'</span></div><ul class="items">';
    items.forEach(function(it){
      html += '<li class="item"><span class="name">'+hl(it[0],q)+(it[2]?'<span class="tag">'+esc(it[2])+'</span>':'')+'</span><span class="price">₹'+it[1]+'</span></li>';
    });
    html += '</ul></section>';
  });
  menuEl.innerHTML = shown ? html : '<p class="empty">Nothing on the menu matches “'+esc(q)+'”. Try another word.</p>';
  chipsEl.innerHTML = chips;
  observe();
}

var io;
function observe(){
  if(io) io.disconnect();
  if(!("IntersectionObserver" in window)) return;
  io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      var links = chipsEl.querySelectorAll("a");
      links.forEach(function(a){
        var on = a.getAttribute("data-id")===e.target.id;
        if(on){a.setAttribute("aria-current","true");
          var box = chipsEl, l = a.offsetLeft - box.offsetLeft;
          box.scrollTo({left:Math.max(0,l-16),behavior:"smooth"});
        } else a.removeAttribute("aria-current");
      });
    });
  },{rootMargin:"-30% 0px -65% 0px"});
  menuEl.querySelectorAll("section").forEach(function(s){io.observe(s)});
}

qEl.addEventListener("input",function(){render(qEl.value)});
render("");