// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.argv._

const treatLockFiles = require('../../script/treat-lock-files');

jest.mock('../../lib/treat-locks/npm.lock');
jest.mock('../../lib/treat-locks/yarn.lock');
jest.mock('../../lib/treat-locks/npm.options');

const npmLockMock = require('../../lib/treat-locks/npm.lock');
const yarnLockMock = require('../../lib/treat-locks/yarn.lock');
const NpmOptionsMock = require('../../lib/treat-locks/npm.options');

const spy = jest.fn();

function Mock(...args) {
  spy(...args);
  NpmOptionsMock.apply(this, args);
}
Mock.prototype = NpmOptionsMock.prototype;

global.console = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

describe('treat-lock-files arguments from npm command', () => {
  beforeEach(() => {
    process.argv = [];
    NpmOptionsMock.mockClear();
    jest.clearAllMocks();
  });

  test('registry defined on npm command', () => {
    process.env.npm_config_argv = '{"remain":[],"cooked":["run","execute","--registry","whatever"],"original":["run","execute","--registry=whatever"]}';

    treatLockFiles();
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(NpmOptionsMock).toHaveBeenCalledWith('whatever', undefined, undefined);
    expect(npmLockMock).toHaveBeenCalledWith('.', '.', expect.any(NpmOptionsMock));
    expect(yarnLockMock).toHaveBeenCalledWith('.', '.', expect.any(NpmOptionsMock));
  });

  test('registry defined on npm command. Empty', () => {
    process.env.npm_config_argv = '{"remain":[],"cooked":["run","execute","--registry","whatever"],"original":["run","execute","--registry="]}';

    treatLockFiles();
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(NpmOptionsMock).toHaveBeenCalledWith('', undefined, undefined);
    expect(npmLockMock).toHaveBeenCalledWith('.', '.', expect.any(NpmOptionsMock));
    expect(yarnLockMock).toHaveBeenCalledWith('.', '.', expect.any(NpmOptionsMock));
  });

  test('npm_config_argv original empty', () => {
    process.env.npm_config_argv = '{"remain":[],"cooked":["run","execute","--registry","whatever"],"original":[]}';

    treatLockFiles();
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(NpmOptionsMock).toHaveBeenCalledWith(undefined, undefined, undefined);
    expect(npmLockMock).toHaveBeenCalledWith('.', '.', expect.any(NpmOptionsMock));
    expect(yarnLockMock).toHaveBeenCalledWith('.', '.', expect.any(NpmOptionsMock));
  });

  test('npm_config_argv but original', () => {
    process.env.npm_config_argv = '{"remain":[],"cooked":["run","execute","--registry","whatever"]}';

    treatLockFiles();
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(NpmOptionsMock).toHaveBeenCalledWith(undefined, undefined, undefined);
    expect(npmLockMock).toHaveBeenCalledWith('.', '.', expect.any(NpmOptionsMock));
    expect(yarnLockMock).toHaveBeenCalledWith('.', '.', expect.any(NpmOptionsMock));
  });
});
