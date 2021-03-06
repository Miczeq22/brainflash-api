#  (2020-10-27)


### Features

- Add card feature ([3e28960](https://github.com/Miczeq22/brainflash-api/commit/3e28960b6a1b206b5c7f98436954d6e39bad802f))
- Add deck rating feature ([daca36d](https://github.com/Miczeq22/brainflash-api/commit/daca36d4b30a55fc82d7d9d60a8d370882717f5f))
- Added cache for queries ([a6dfffb](https://github.com/Miczeq22/brainflash-api/commit/a6dfffbb5c11959843ec702c98633a40ac4e152e))
- Added deck read model ([32f426f](https://github.com/Miczeq22/brainflash-api/commit/32f426f71a3061886ad627b704aa039ac06317cb))
- Card persistence ([dd19bd3](https://github.com/Miczeq22/brainflash-api/commit/dd19bd3680e5bd1c81948275c4b0a9ba07798e2f))
- Confirm user account feature ([cdb4508](https://github.com/Miczeq22/brainflash-api/commit/cdb45085547ee0baefac05c3726a57a706ca3d84))
- CORS middleware ([8372ca3](https://github.com/Miczeq22/brainflash-api/commit/8372ca37caebd56533d39955684fd793e5582dbf))
- Create new deck feature ([568d4b0](https://github.com/Miczeq22/brainflash-api/commit/568d4b09410d82eedfc4b2333290ce6173c13e29))
- Delete deck image ([25f6cc8](https://github.com/Miczeq22/brainflash-api/commit/25f6cc8bcd4b5bc5fdaf1c7e6f2b135b3ad1335a))
- Domain tools ([1ed8e4c](https://github.com/Miczeq22/brainflash-api/commit/1ed8e4cb026d418a42e511f144e77165af732d08))
- Enroll deck feature ([a0203b4](https://github.com/Miczeq22/brainflash-api/commit/a0203b470c00c70cd3dcbf3f237d22274c3f9fd9))
- Error handler middleware ([d62e86f](https://github.com/Miczeq22/brainflash-api/commit/d62e86f46c1b8422a5b32d85680b8e12d2383a98))
- Get all decks with simple pagination feature ([7944a0e](https://github.com/Miczeq22/brainflash-api/commit/7944a0eace71a6f0a8c398528a4a463fc7cde82a))
- Get all tags query ([ca14ac3](https://github.com/Miczeq22/brainflash-api/commit/ca14ac3395d4a9035b64e9e2fb24944e57de6987))
- Get deck by id feature ([4264354](https://github.com/Miczeq22/brainflash-api/commit/42643549d6c27241c83a5f0ff828f3c10c5f1819))
- Login feature ([0861cb1](https://github.com/Miczeq22/brainflash-api/commit/0861cb15d61f71a415772c962383713928251bf2))
- Publish deck feature ([42a87c3](https://github.com/Miczeq22/brainflash-api/commit/42a87c362619b1513bbe40f49d922fb6bae30398))
- Refresh token feature ([df9130c](https://github.com/Miczeq22/brainflash-api/commit/df9130ce48e8b3f01038cf2f76a6308511562f2c))
- Register User Command ([cf520a7](https://github.com/Miczeq22/brainflash-api/commit/cf520a7001d89b3595bc08abad3e4ecb6b392353))
- Remove card feature ([96e5bb1](https://github.com/Miczeq22/brainflash-api/commit/96e5bb1b19e259297a1782f03f81a127a07b7b47))
- Remove deck feature ([af8b633](https://github.com/Miczeq22/brainflash-api/commit/af8b633338c4de28702bc9f660aa672a999eb6c0))
- Remove deck rating feature ([7ddc441](https://github.com/Miczeq22/brainflash-api/commit/7ddc441fb9d4f7798f3691b9c3de456daab259a7))
- Schedule deck ([74ea854](https://github.com/Miczeq22/brainflash-api/commit/74ea854216f0e5377ccbe1debcfbdea9856b6fa1))
- Security Middleware ([08ea082](https://github.com/Miczeq22/brainflash-api/commit/08ea0826dfcd30484a390e23665a6e443a624dd0))
- Server bootstrap ([9a1e2f2](https://github.com/Miczeq22/brainflash-api/commit/9a1e2f21d6db5e1b62a5df019e4a8bfb975fb921))
- Thumbnail generation lambda ([790628a](https://github.com/Miczeq22/brainflash-api/commit/790628a95786a5a01041ec3107989d558247d12d))
- Unpublish deck feature ([34a80fd](https://github.com/Miczeq22/brainflash-api/commit/34a80fd96ea21b7fa93cfc5034b558901f50ae06))
- Unschedule deck feature ([a07bc54](https://github.com/Miczeq22/brainflash-api/commit/a07bc54cabf61f1381cc9842eeed57f4ebd1e1f8))
- Update deck metadata feature ([bb931e6](https://github.com/Miczeq22/brainflash-api/commit/bb931e69bee1010d6a3373815591bf8a0961b24b))
- Update deck name ([fa90cbd](https://github.com/Miczeq22/brainflash-api/commit/fa90cbdab7dca1bb15454d5eade477a1e0c188e8))
- Update user password feature ([3e9ff21](https://github.com/Miczeq22/brainflash-api/commit/3e9ff216832e081b43e6809d278cbabd94428357))
- Upload deck image with local storage config ([0e4b793](https://github.com/Miczeq22/brainflash-api/commit/0e4b79359a7b5bff670584ec5fc4db769ad975e4))
- User Registration Domain ([afd329a](https://github.com/Miczeq22/brainflash-api/commit/afd329aa493813c5f85492ec6582898a363b2ac4))
- User registration endpoint ([f6dd65b](https://github.com/Miczeq22/brainflash-api/commit/f6dd65bcb088abcb1faf699ecd0355da182f25b6))


### Refactoring & Improvements

- Added isOwner to deck query field. Fixed bugs related to updating deck model after publish/unpublish ([e059e9c](https://github.com/Miczeq22/brainflash-api/commit/e059e9c6ffbc16d45b50d88ac1a9e5eed04b01bd))
- Added published prop to deck ([01745c6](https://github.com/Miczeq22/brainflash-api/commit/01745c6954f47cf6b14d6b79fd5103951315a486))
- Added scheduled date validation ([d135a98](https://github.com/Miczeq22/brainflash-api/commit/d135a98796775719938a15874d3c7472fa8ac8dc))
- Added single deck mock ([2eb09cb](https://github.com/Miczeq22/brainflash-api/commit/2eb09cb0ee295a5137c21471e37711c43802014e))
- Added thuimbnail property ([2c6edc8](https://github.com/Miczeq22/brainflash-api/commit/2c6edc8047c7ba75c57df0732cfa5f15528cc027))
- Added unauthenticated error ([339003f](https://github.com/Miczeq22/brainflash-api/commit/339003ff135248b2c3bc0db6f8e00b0fc1a28f2e))
- Decks -> deck ([8d3c834](https://github.com/Miczeq22/brainflash-api/commit/8d3c83471d3394f47003ba5c50f3d49e212d3dde))
- Fixed minor bugs ([55b0903](https://github.com/Miczeq22/brainflash-api/commit/55b09036cc71864554b1a524f5a00b37993ec5ca))
- Get enrolled deck if is not public ([ebcb4a9](https://github.com/Miczeq22/brainflash-api/commit/ebcb4a9b86970cdac57d4ed562e74a4abd7caba5))
- Query deck cards ([1b29d48](https://github.com/Miczeq22/brainflash-api/commit/1b29d4850e1ab5f516505440423d0ce6871d0df6))
- Redirect user to front end after validation ([ae391e0](https://github.com/Miczeq22/brainflash-api/commit/ae391e04924560b1ec3116d12b55818e256c14a8))
- Refactored domain events to use map instead object ([e4da6bf](https://github.com/Miczeq22/brainflash-api/commit/e4da6bf4d869aae81582bbe1a5dce3f94a7be88a))
- Removed cache for decks in pagination ([0b27fab](https://github.com/Miczeq22/brainflash-api/commit/0b27fabdb1993c00d2caab324b05b1beda19f542))
- Update deck read model ([a9007c6](https://github.com/Miczeq22/brainflash-api/commit/a9007c672a9ead5421f14aa72f0003dcd43464e4))
- Update image in metadata endpoint ([18a4f33](https://github.com/Miczeq22/brainflash-api/commit/18a4f33a8dfdfc5c09332f43ee1ef36d204aab48))
- Updated PUT to PATCH method if makes sense ([f195bce](https://github.com/Miczeq22/brainflash-api/commit/f195bcec094bdb4e2141880c86f21d593df67270))


### Bug Fixes

- Fixed rating calculation ([c2283b3](https://github.com/Miczeq22/brainflash-api/commit/c2283b33f1256d6c36abccd7e59b80b5a1b47276))


### Tooling

- Added postgres database layer ([164a310](https://github.com/Miczeq22/brainflash-api/commit/164a31087b591c996669ca37681223cd52067272))
- Mailer service ([f7ba499](https://github.com/Miczeq22/brainflash-api/commit/f7ba499511a4ef24ea49846e268d2ac9d298d326))
- Processing tools ([4b91c8d](https://github.com/Miczeq22/brainflash-api/commit/4b91c8d4fbd237d3d4303fddc17155a8b262119f))


### Documentation

- README Update ([7c5478c](https://github.com/Miczeq22/brainflash-api/commit/7c5478c708ffbb8e63392b74cfe078f246c4a391))
- Updated README ([0fb17c8](https://github.com/Miczeq22/brainflash-api/commit/0fb17c8be0ee62a55b1a92b794efb0a9d6960cfa))


### Miscellaneous

-  ✨ Sending register validation email ([2213f59](https://github.com/Miczeq22/brainflash-api/commit/2213f59417149af361e5c0dbf62792f11dfb3df1))
- Project init ([810b859](https://github.com/Miczeq22/brainflash-api/commit/810b859114ba5792eb727801a3231b1f3f2c2fe8))

