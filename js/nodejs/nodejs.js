'use strict';
angular.module('crosslight.nodejs', [])

        .factory('childprocess', function () {

            var factory = {};

            factory.call = function (path, arg, stdoutcallback, stderrcallback, closecallback) {
                try {
                    var spawn = require('child_process').spawn,
                            ls = spawn(path, arg);
                    ls.stdout.on('data', stdoutcallback);
                    ls.stderr.on('data', stderrcallback);
                    ls.on('close', closecallback);
                } catch (e) {
                    alert("childprocess.call error:\r\n" + e);
                    return;
                }
            };

            //comment: arg is the target file. It is recommended to pass only the file name in arg, not arg = file path + file name.
            factory.callbackground = function (path, arg, outputpath, stdoutcallback, stderrcallback, closecallback) {
                try {
                    var command = path + ' ' + arg; //add by feiyang
                    var spawn = require('child_process').spawn,
                            ls = spawn('cmd', ['/s', '/c', command], {//revised by feiyang
                                //encoding: 'utf8',
                                cwd: outputpath,
                                env: process.env,
                                detached: false
                            });
                    ls.stdout.on('data', stdoutcallback);
                    ls.stderr.on('data', stderrcallback);
                    ls.on('close', closecallback);
                } catch (e) {
                    alert("childprocess.callbackground error:\r\n" + e);
                    return;
                }
            };

            /**
             * Function name: call_detached
             * Description:   open the .exe program, the program is detached with simucenterJS.exe                
             * Author:        Feiyang (mdjacky.cai@gmail.com / feiycai@foxmail.com)
             * Last Modify:   2015-12-11
             * @param         path of .exe file, target file path, target file folder path
             * @returns       none
             */
            factory.call_detached = function (path, arg, outpath) {
                try {
                    var spawn = require('child_process').spawn,
                            ls = spawn(path, [arg], {//revised by feiyang
                                cwd: outpath,
                                env: process.env,
                                detached: true
                            });
                } catch (e) {
                    alert('childprocess.call_detached error:\r\n' + e);
                    return;
                }
            }
            return factory;
        })

        .factory('file', function () {

            var factory = {};

            var fs = require('fs');
            var path = require('path');

            var exists = function (path) {
                return fs.existsSync(path) || path.existsSync(path);
            };

            /**
             * 返回文件后缀名
             */
            factory.extensionName = function (filename) {
                try {
                    return path.extname(filename);
                } catch (e) {
                    alert('file.extensionName error:\r\n' + e);
                    return;
                }
            };

            /**
             * 异步写文件 Write files asynchronously
             */
            factory.writeall = function (filefullpath, data, callbackfunc) {
                try {
                    fs.writeFile(filefullpath, data, callbackfunc);
                } catch (e) {
                    alert('file.writeall error:\r\n' + e);
                    return;
                }
            };

            /**
             * 同步写文件 Write files synchronously
             */
            factory.writeallsync = function (filefullpath, data) {
                try {
                    fs.writeFileSync(filefullpath, data, 'utf8');
                } catch (e) {
                    alert("file.writeallsync error:\r\n" + e);
                    return;
                }
            };

            /**
             * 异步读文件 Asynchronous read files
             */
            factory.readall = function (filefullpath, callbackfunc) {
                try {
                    fs.readFile(filefullpath, 'utf8', callbackfunc);
                } catch (e) {
                    alert('file.readall error:\r\n' + e);
                    return;
                }
            };

            /**
             * 同步读文件 ----------------此处可能会造成js error，引起系统界面崩溃 Reading files synchronously ---------------- This may cause js error, causing the system interface to crash
             */
            factory.readallsync = function (filefullpath) {
                try {
                    return fs.readFileSync(filefullpath, 'utf8');
                } catch (e) {
                    alert('file.readallsync error:\r\n' + e);
                    return;
                }
            };

            /**
             * 同步删除文件 Delete files synchronously
             */
            factory.delfile = function (filefullpath) {
                try {
                    fs.unlinkSync(filefullpath);
                } catch (e) {
                    alert('file.delfile error:\r\n' + e);
                    return;
                }
            };

            /**
             * 异步读文件夹 Asynchronous read folder
             */
            factory.readfolder = function (filefullpath, callbackfunc) {
                try {
                    fs.readdir(filefullpath, callbackfunc);
                } catch (e) {
                    alert('file.readfolder error:\r\n' + e);
                    return;
                }
            };

            /**
             * 同步读取文件夹 ----------------此处可能会造成js error，系统界面崩溃
             */
            factory.readfoldersync = function (filefullpath) {
                try {
                    return fs.readdirSync(filefullpath);
                } catch (e) {
                    alert('file.readfoldersync error:\r\n' + e);
                    return;
                }
            };

            /**
             * 同步创建文件夹
             */
            factory.mkdirsync = function (fullpath) {
                try {
                    fs.mkdirSync(fullpath, '0777');
                } catch (e) {
                    alert('file.mkdirsync error:\r\n' + e);
                    return;
                }
            };

            /**
             * 删除文件夹（文件夹下不可有文件）
             */
            factory.rmdirsync = function (dirpath) {
                try {
                    fs.rmdirSync(dirpath);
                } catch (e) {
                    alert('file.rmdirsync error:\r\n' + e);
                    return;
                }
            };

            /**
             * 文件或文件夹是否存在
             */
            factory.existsfile = function (fullpath) {
                try {
                    return fs.existsSync(fullpath);
                } catch (e) {
                    alert('file.existsfile error:\r\n' + e);
                    return;
                }
            };

            /**
             * 同步文件重命名
             */
            factory.filerename = function (path1, path2) {
                try {
                    return fs.renameSync(path1, path2);
                } catch (e) {
                    alert('file.filerename error:\r\n' + e);
                    return;
                }
            };

            /**
             * 判断所给路径是否是文件
             */
            factory.isFile = function (filepath) {
                try {
                    return exists(filepath) && fs.statSync(filepath).isFile();
                } catch (e) {
                    alert('file.isFile error:\r\n' + e);
                    return;
                }
            };

            /**
             * 返回文件信息（创建时间，修改时间，访问时间，大小等）
             */
            factory.statSync = function (filepath) {
                try {
                    return fs.statSync(filepath);
                } catch (e) {
                    alert('file.statSync error:\r\n' + e);
                    return;
                }
            };

            return factory;
        });
