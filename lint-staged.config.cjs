module.exports = {
  "*.{ts,js}": ["eslint --fix"],
  "*.ts": () => "vue-tsc --noEmit"
}
