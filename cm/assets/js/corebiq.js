
lucide.createIcons();

const sidebar=document.getElementById("sidebar");
const overlay=document.getElementById("sidebarOverlay");
const menuBtn=document.getElementById("menuBtn");
const mainContent=document.getElementById("mainContent");
const searchInput=document.getElementById("globalSearch");
const clearSearchBtn=document.getElementById("clearSearchBtn");

function openSidebar(){sidebar?.classList.add("active");overlay?.classList.add("active")}
function closeSidebar(){sidebar?.classList.remove("active");overlay?.classList.remove("active")}
menuBtn?.addEventListener("click",openSidebar);overlay?.addEventListener("click",closeSidebar);

document.querySelectorAll(".menu-item.expandable").forEach(menu=>{
  menu.addEventListener("click",()=>{
    const submenu=menu.nextElementSibling;
    menu.classList.toggle("open");submenu?.classList.toggle("open");
  });
});

function navigate(url){window.location.href=url}
document.querySelectorAll("[data-href]").forEach(el=>el.addEventListener("click",()=>navigate(el.dataset.href)));

searchInput?.addEventListener("input",e=>{
  if(clearSearchBtn) clearSearchBtn.style.visibility=e.target.value?"visible":"hidden";
});
clearSearchBtn?.addEventListener("click",()=>{searchInput.value="";clearSearchBtn.style.visibility="hidden";searchInput.focus()});

document.querySelectorAll("[data-back]").forEach(el=>el.addEventListener("click",()=>history.back()));

function wireQuickCreate(){
 document.querySelectorAll("[data-create]").forEach(el=>el.addEventListener("click",()=>navigate(el.dataset.create)));
}
wireQuickCreate();
