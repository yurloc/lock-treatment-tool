// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at

//   http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.argv._

const readline = require('line-reader');
const uuidv4 = require('uuid/v4');
const yarnLock = require('../../lib/treat-locks/yarn.lock');
const commonLock = require('../../lib/treat-locks/common.lock');
const NpmOptions = require('../../lib/treat-locks/npm.options');

function checkLine(line, npmOptions) {
  if (line.startsWith('  resolved "http')) {
    return npmOptions.registry === commonLock.getHost(line);
  }
  if (line.startsWith('  integrity ') && npmOptions.skipIntegrity === false) {
    return npmOptions.skipIntegrity === false;
  }
  return true;
}

test('Verify still working if the file yarn.lock does not exist', () => {
  expect(yarnLock('./test', './test')).toBe(false);
});

test('Verify it does not work when the file yarn.lock exists but registry', () => {
  const uuid = uuidv4();
  expect(yarnLock('./__test__/resources', `./__test__/resources/execution-${uuid}`)).toBe(false);
});

test('Verify it works when the file yarn.lock exists', () => {
  const uuid = uuidv4();
  const npmOptions = new NpmOptions('http://redhat.com/');
  expect(yarnLock('./__test__/resources', `./__test__/resources/execution-${uuid}`, npmOptions)).toBe(true);
  readline.eachLine(`./__test__/resources/execution-${uuid}/yarn.lock`, (line) => {
    console.log(line);
    expect(checkLine(line, npmOptions)).toBe(true);
  });
});
