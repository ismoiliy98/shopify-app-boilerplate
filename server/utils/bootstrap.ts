import moduleAlias from 'module-alias'
import { compilerOptions as _ } from '../tsconfig.json'
require('dotenv').config()
Object.entries(_.paths).forEach((a) =>
  moduleAlias.addAlias(
    a[0].replace(/\/?\*$/g, ''),
    `${__dirname}/../${a[1][0].replace(/\/?\*$/g, '')}`
  )
)
