export function stringToExamples(value) {
  if (!value) return []
  const reg = '<input>([\\s\\S]+?)</input><output>([\\s\\S]+?)</output>'
  const re = RegExp(reg, 'g')
  const objList = []
  let tmp
  // eslint-disable-next-line no-cond-assign
  while (tmp = re.exec(value)) {
    objList.push({ input: tmp[1], output: tmp[2] })
  }
  return objList
}

export function examplesToString(objList) {
  if (!objList) return ''
  let result = ''
  for (const obj of objList) {
    result += '<input>' + obj.input + '</input><output>' + obj.output + '</output>'
  }
  return result
}
