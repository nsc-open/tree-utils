const ENV = process.env['ENV']
const presets = ENV === 'test' ? [
  [
    "@babel/preset-env",
    { targets: { esmodules: true } }
  ]
] : [
  [
    "@babel/preset-env",
    { targets: "cover 99.5%" }
  ]
]

const plugins = [
  "@babel/plugin-proposal-class-properties",
  "@babel/plugin-proposal-object-rest-spread"
]

module.exports = {
  presets, plugins
}