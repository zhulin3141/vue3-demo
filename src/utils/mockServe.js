import Mock from 'mockjs'

import daily from '../../data/covid19-daily-list.json'
import overall from '../../data/covid19-overall.json'
import province from '../../data/covid19-province.json'

Mock.mock('/mock/area', province)
Mock.mock('/mock/overall', overall)
Mock.mock('/mock/daily', daily)
