document.querySelector("div[class*='highlighter']:last-of-type code").addEventListener("click", function() {
  let sel = window.getSelection();
  sel.removeAllRanges();
  let range = document.createRange();
  range.selectNodeContents(this);
  sel.addRange(range);
});
