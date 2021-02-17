const { entries, fromEntries, defineProperties } = Object
const immen = { writable: false, enumberable: true }
const mapProps = ([key, value]) => [key, { value, ...immen }]
const lock = (obj, props) => defineProperties(obj, fromEntries(entries(props).map(mapProps)))

export { lock }
