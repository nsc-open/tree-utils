const ENV = process.env['ENV']
const presets = ENV === 'test' ? [
  [
    "@babel/preset-env",
    { targets: "> 0.25%, not dead" }
  ]
] : [
  [
    "@babel/preset-env",
    { targets: { esmodules: true } }
  ]
]

const plugins = [
  "@babel/plugin-proposal-class-properties",
  "@babel/plugin-proposal-object-rest-spread"
]

module.exports = {
  presets, plugins
}