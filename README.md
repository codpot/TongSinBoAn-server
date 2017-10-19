# TongSinBoAn-server

2017년 군장병 공개SW 역량강화캠프에서 개발된 '통신보안' 앱의 백엔드 서버입니다.

## 특징

  * 하나의 서버로 여러 부대에서 활용 가능
  * 지정된 시간동안 1회에 한해 유효한 출입증 생성 가능
  * 다양한 보안 정책 생성 가능
  * 정책마다 다른 복수의 관리자 지정 가능
  * 부대 규정에 맞도록 서버 설정 변경 용이
  * 다른 장비 및 프로그램에 응용 가능한 API
  * 계정 권한을 유저, 관리자, 마스터 3단계로 완전히 분리

## 설치

TongSinBoAn-server는 ES2015 및 비동기 기능 지원을 위해 노드 v7.6.0 이상이 필요합니다.

```bash
$ git clone https://github.com/codpot/TongSinBoAn-server
$ cd TongSinBoAn-server
$ npm install
```

## 데이터베이스 구축

데이터베이스 관리 시스템(DBMS)으로는 MySQL 혹은 이와 호환되는 MariaDB가 필요합니다.

서버를 사용하기 위해 제공된 [schema.sql](schema.sql) 파일을 DB에 import 해야 합니다.

```bash
$ mysql -u [사용자아이디] -p [데이터베이스명] < schema.sql
```

## 서버 설정

서버 환경에 맞게 [.env](.env) 파일을 수정하셔야 합니다.

```
# Server
PORT=80 # 서버 사용 포트

# Token
TOKEN_EXPIRE=60 # 출입증 유효 기간 (단위: 초)

# Session
SESSION_SECRET=thisissecretkey # 세션 검증키
SESSION_EXPIRE=86400 # 세션 유효 기간 (단위: 초)

# Database
DB_HOST=localhost # DB 호스트
DB_PORT=3306 # DB 포트
DB_USER=root # DB 회원
DB_PASS=root # DB 비밀번호
DB_NAME=tongsinboan # DB 데이터베이스명
DB_POOL=10 # DB 접속 풀 사이즈
```

## 서버 실행

Linux 배시 셸 (Linux Bash Shell)

```bash
$ NODE_ENV=production npm start
```

Windows 명령 프롬프트 (Windows Command Prompt)

```bash
> set NODE_ENV=production && npm start
```

## API

모든 POST, PUT 요청에는 다음의 헤더가 필요합니다.

<code>Content-Type: application/json; charset=utf-8</code>

#### 부대

- <code>POST</code> /group - 부대 생성 API

    부대를 아직 생성하지 않았거나 부대 가입 후 승인받지 못했을 경우 호출이 가능합니다.

    - 요청 JSON

        ```
        {"name": "부대명"}
        ```

    - 응답 JSON

        ```
        {"result": true} // 성공
        {"result": false, "msg": "authentication_required"} // 로그인 필요
        {"result": false, "msg": "group_exists"} // 이미 부대를 생성했거나 가입되어 있음
        {"result": false, "msg": "group_create_failed"} // 부대 생성 실패 (서버 오류)
        {"result": false, "msg": "group_join_failed"} // 부대 가입 실패 (서버 오류)
        ```

- <code>POST</code> /group/join - 부대 가입 API

    부대를 아직 생성하지 않았거나 부대 가입 후 승인받지 못했을 경우 호출이 가능합니다.

    - 요청 JSON

        ```
        {"group_idx": 부대고유번호}
        ```

    - 응답 JSON

        ```
        {"result": true} // 성공
        {"result": false, "msg": "authentication_required"} // 로그인 필요
        {"result": false, "msg": "group_exists"} // 이미 부대를 생성했거나 가입되어 있음
        {"result": false, "msg": "group_join_failed"} // 부대 가입 실패 (부대고유번호 오류)
        ```

#### 회원

- <code>GET</code> /member - 회원 목록 API

    권한이 마스터인 경우 호출이 가능합니다.

    - 응답 JSON
    
        ```
        {
            "result": true,
            "data": [
                {
                    "idx": 1,
                    "name": "관리자",
                    "group_idx": 1,
                    "group_name": "육군",
                    "belong": "OO사령부",
                    "level": 3,
                    "profile_img": null,
                    "token": "4fe692c0df8263e2571fe6fea61be426",
                    "token_valid": "0000-00-00 00:00:00",
                    "mdm_camera": 0,
                    "mdm_mic": 0,
                    "mdm_gps": 0,
                    "mdm_wifi": 0,
                    "mdm_hotspot": 0,
                    "mdm_bluetooth": 0,
                    "regdate": "2017-10-17T04:20:16.000Z"
                },
                {
                    "idx": 2,
                    "name": "이름",
                    "group_idx": 1,
                    "group_name": "육군",
                    "belong": "00사령부 참모부",
                    "level": 1,
                    "profile_img": null,
                    "token": null,
                    "token_valid": null,
                    "mdm_camera": 0,
                    "mdm_mic": 0,
                    "mdm_gps": 0,
                    "mdm_wifi": 0,
                    "mdm_hotspot": 0,
                    "mdm_bluetooth": 0,
                    "regdate": "2017-10-18T07:06:17.000Z"
                }
            ]
        } // 성공
        {"result": false, "msg": "authentication_required"} // 권한이 없음
        {"result": false, "msg": "member_read_failed"} // 회원 조회 실패 (서버오류)
        ```

- <code>POST</code> /member - 회원가입 API

    - 요청 JSON

        ```
        {"userid": "admin", "passwd": "password", "name": "관리자"}
        ```

    - 응답 JSON

        ```
        {"result": true} // 성공
        {"result": false, "msg": "member_userid_exists"} // 이미 존재하는 아이디
        {"result": false, "msg": "member_create_failed"} // 회원가입 실패 (서버오류)
        ```

- <code>POST</code> /member/accept - 회원 승인 API

    권한이 마스터인 경우 호출이 가능합니다.

    - 요청 JSON

        ```
        {"member_idx": 회원고유번호}
        ```

    - 응답 JSON

        ```
        {"result": true} // 성공
        {"result": false, "msg": "authentication_required"} // 권한이 없거나 이미 승인된 회원
        {"result": false, "msg": "member_read_failed"} // 존재하지 않는 회원
        {"result": false, "msg": "member_accept_failed"} // 회원 승인 실패 (서버오류)
        ```

- <code>POST</code> /member/login - 로그인 API

    - 요청 JSON

        ```
        {"userid": "admin", "passwd": "password"}
        ```

    - 응답 JSON

        ```
        {
            "result": true,
            "data": {
                "idx": 1,
                "name": "관리자",
                "group_idx": 1,
                "group_name": "육군",
                "belong": "00사령부",
                "level": 3,
                "profile_img": null,
                "token": "4fe692c0df8263e2571fe6fea61be426",
                "token_valid": "0000-00-00 00:00:00",
                "mdm_camera": 0,
                "mdm_mic": 0,
                "mdm_gps": 0,
                "mdm_wifi": 0,
                "mdm_hotspot": 0,
                "mdm_bluetooth": 0,
                "regdate": "2017-10-17T04:20:16.000Z"
            }
        } // 성공
        {"result": false, "msg": "member_login_failed"} // 로그인 실패
        ```

- <code>GET</code> /member/logout - 로그아웃 API

    - 응답 JSON

        ```
        {"result": true} // 성공
        {"result": false, "msg": "authentication_required"} // 로그인 되어 있지 않음
        ```

- <code>GET</code> /member/me - 본인 정보 API

    - 응답 JSON

        ```
        {
            "result": true,
            "data": {
                "idx": 1,
                "name": "관리자",
                "group_idx": 1,
                "group_name": "육군",
                "belong": "00사령부",
                "level": 0,
                "profile_img": null,
                "token": "4fe692c0df8263e2571fe6fea61be426",
                "token_valid": "2017-10-18T08:03:09.000Z",
                "mdm_camera": 0,
                "mdm_mic": 0,
                "mdm_gps": 0,
                "mdm_wifi": 0,
                "mdm_hotspot": 0,
                "mdm_bluetooth": 0,
                "regdate": "2017-10-17T04:20:16.000Z"
            }
        } // 성공
        {"result": false, "msg": "authentication_required"} // 로그인 되어 있지 않음
        {"result": false, "msg": "member_read_failed"} // 정보 조회 실패 (서버오류)
        ```

- <code>GET</code> /member/token - 토큰 생성 API

    - 응답 JSON

        ```
        {
            "result": true,
            "data": {
                "token": "f3f1e3369bb9f5e3074fc1c41de9b01e",
                "expire": 60,
                "expire_at": "2017-10-18 17:03:09"
            }
        } // 성공
        {"result": false, "msg": "authentication_required"} // 로그인 되어 있지 않음
        {"result": false, "msg": "member_token_create_failed"} // 토큰 생성 실패 (서버오류)
        ```

#### 정책

- <code>GET</code> /policy - 정책 조회 API

    본인에게 해당되는 정책만 표시됩니다.

    - 응답 JSON

        ```
        {
            "result": true,
            "data": [
                {
                    "idx": 1,
                    "group_idx": 1,
                    "name": "부대 IN",
                    "comment": "부대에 들어갈 때 필요한 권한입니다.",
                    "mdm_camera": 1,
                    "mdm_mic": 1,
                    "mdm_gps": 1,
                    "mdm_wifi": 1,
                    "mdm_hotspot": 1,
                    "mdm_bluetooth": 1
                }
            ]
        } // 성공
        {"result": false, "msg": "authentication_required"} // 로그인 되어 있지 않음
        ```

- <code>POST</code> /policy - 정책 생성 API

    권한이 마스터인 경우 호출이 가능합니다.

    - 요청 JSON

        ```
        {"name": "부대 IN", "comment": "부대에 들어갈 때 필요한 권한입니다.", "mdm_camera": 1, "mdm_mic": 1, "mdm_gps": 1, "mdm_wifi": 1, "mdm_hotspot": 1, "mdm_bluetooth": 1}
        
        * mdm_* - 활성화: 1, 비활성화: 1, 상태유지: 2
        ```

    - 응답 JSON

        ```
        {"result": true} // 성공
        {"result": false, "msg": "authentication_required"} // 권한이 없음
        {"result": false, "msg": "policy_create_failed"} // 정책 생성 실패 (서버오류 혹은 잘못된 mdm 값)
        ```

- <code>PUT</code> /policy/:policy_idx - 정책 수정 API

    권한이 마스터인 경우 호출이 가능합니다.

    - 요청 JSON

        ```
        {"name": "부대 IN", "comment": "부대에 들어갈 때 필요한 권한입니다.", "mdm_camera": 1, "mdm_mic": 1, "mdm_gps": 1, "mdm_wifi": 1, "mdm_hotspot": 1, "mdm_bluetooth": 1}
        
        * mdm_* - 활성화: 1, 비활성화: 1, 상태유지: 2
        ```

    - 응답 JSON

        ```
        {"result": true} // 성공
        {"result": false, "msg": "authentication_required"} // 권한이 없음
        {"result": false, "msg": "policy_update_failed"} // 정책 수정 실패 (서버오류 혹은 잘못된 mdm 값)
        ```

- <code>DELETE</code> /policy/:policy_idx - 정책 삭제 API

    권한이 마스터인 경우 호출이 가능합니다.

    - 응답 JSON

        ```
        {"result": true} // 성공
        {"result": false, "msg": "authentication_required"} // 권한이 없음
        {"result": false, "msg": "policy_delete_failed"} // 정책 삭제 실패 (서버오류)
        ```

- <code>GET</code> /policy/:policy_idx/user - 정책을 적용받는 회원 조회 API

    권한이 마스터인 경우 호출이 가능합니다.

    - 응답 JSON

        ```
        {
            "result": true,
            "data": [
                {
                    "policy_idx": 1,
                    "member_idx": 1,
                    "chgdate": "2017-10-19T14:09:45.000Z",
                    "userid": "admin",
                    "name": "보안담당자",
                    "belong": "감찰보안실",
                    "profile_img": null
                },
                {
                    "policy_idx": 1,
                    "member_idx": 2,
                    "chgdate": "2017-10-19T07:58:58.000Z",
                    "userid": "user",
                    "name": "간부",
                    "belong": "사무실",
                    "profile_img": null
                },
                {
                    "policy_idx": 1,
                    "member_idx": 3,
                    "chgdate": "2017-10-19T14:10:05.000Z",
                    "userid": "admin",
                    "name": "위병사관",
                    "belong": "위병소",
                    "profile_img": null
                }
            ]
        } // 성공
        {"result": false, "msg": "authentication_required"} // 로그인 되어 있지 않음
        {"result": false, "msg": "policy_read_user_failed"} // 정책 회원 조회 실패 (서버오류)
        ```

- <code>POST</code> /policy/:policy_idx/user - 정책을 적용받는 회원 추가 API

    권한이 마스터인 경우 호출이 가능합니다.

    - 요청 JSON

        ```
        {"member_idx": 회원고유번호}
        ```

    - 응답 JSON

        ```
        {"result": true} // 성공
        {"result": false, "msg": "authentication_required"} // 권한이 없음
        {"result": false, "msg": "policy_create_user_failed"} // 정책 회원 추가 실패 (서버오류)
        ```

- <code>DELETE</code> /policy/:policy_idx/user/:member_idx - 정책을 적용받는 회원 삭제 API

    권한이 마스터인 경우 호출이 가능합니다.

    - 응답 JSON

        ```
        {"result": true} // 성공
        {"result": false, "msg": "authentication_required"} // 권한이 없음
        {"result": false, "msg": "policy_delete_user_failed"} // 정책 회원 삭제 실패 (서버오류)
        ```

- <code>GET</code> /policy/:policy_idx/admin - 정책 관리자 조회 API

    권한이 마스터인 경우 호출이 가능합니다.

    - 응답 JSON

        ```
        {
            "result": true,
            "data": [
                {
                    "policy_idx": 1,
                    "member_idx": 3,
                    "chgdate": "2017-10-19T14:10:05.000Z",
                    "userid": "admin",
                    "name": "위병사관",
                    "belong": "위병소",
                    "profile_img": null
                }
            ]
        } // 성공
        {"result": false, "msg": "authentication_required"} // 로그인 되어 있지 않음
        {"result": false, "msg": "policy_read_admin_failed"} // 정책 관리자 조회 실패 (서버오류)
        ```

- <code>POST</code> /policy/:policy_idx/admin - 정책 관리자 추가 API

    권한이 마스터인 경우 호출이 가능합니다.

    - 요청 JSON

        ```
        {"member_idx": 회원고유번호}
        ```

    - 응답 JSON

        ```
        {"result": true} // 성공
        {"result": false, "msg": "authentication_required"} // 권한이 없음
        {"result": false, "msg": "policy_create_admin_failed"} // 정책 관리자 추가 실패 (서버오류)
        {"result": false, "msg": "policy_member_update_failed"} // 정책 관리자 레벨 변경 실패 (서버오류)
        ```

- <code>DELETE</code> /policy/:policy_idx/admin/:member_idx - 정책 관리자 삭제 API

    권한이 마스터인 경우 호출이 가능합니다.

    - 응답 JSON

        ```
        {"result": true} // 성공
        {"result": false, "msg": "authentication_required"} // 권한이 없음
        {"result": false, "msg": "policy_delete_admin_failed"} // 정책 관리자 삭제 실패 (서버오류)
        ```

- <code>GET</code> /policy/admin - 관리자용 정책 조회 API

    권한이 마스터인 경우 모든 정책, 관리자인 경우 본인에게 할당된 정책을 조회할 수 있습니다.

    - 응답 JSON

        ```
        {
            "result": true,
            "data": [
                {
                    "idx": 1,
                    "group_idx": 1,
                    "name": "부대 IN",
                    "comment": "부대에 들어갈 때 필요한 권한입니다.",
                    "mdm_camera": 1,
                    "mdm_mic": 1,
                    "mdm_gps": 1,
                    "mdm_wifi": 1,
                    "mdm_hotspot": 1,
                    "mdm_bluetooth": 1
                },
                {
                    "idx": 2,
                    "group_idx": 1,
                    "name": "부대 OUT",
                    "comment": "부대에서 밖으로 나갈 때 필요한 권한입니다.",
                    "mdm_camera": 0,
                    "mdm_mic": 0,
                    "mdm_gps": 0,
                    "mdm_wifi": 0,
                    "mdm_hotspot": 0,
                    "mdm_bluetooth": 0
                },
                {
                    "idx": 3,
                    "group_idx": 1,
                    "name": "201호 출입",
                    "comment": "201호에 출입할 때 필요한 권한입니다.",
                    "mdm_camera": 2,
                    "mdm_mic": 2,
                    "mdm_gps": 2,
                    "mdm_wifi": 2,
                    "mdm_hotspot": 2,
                    "mdm_bluetooth": 2
                }
            ]
        } // 성공
        {"result": false, "msg": "authentication_required"} // 로그인 되어 있지 않음
        {"result": false, "msg": "policy_read_failed"} // 정책 조회 실패 (서버오류)
        ```

- <code>POST</code> /policy/verify/:policy_idx - 정책 검증 API

    권한이 마스터인 경우 모든 정책, 관리자인 경우 본인에게 할당된 정책을 검증할 수 있습니다.

    - 요청 JSON

        ```
        {"token": "사용자 토큰"}
        ```

    - 응답 JSON

        ```
        {
            "result": true,
            "data": {
                "idx": 2,
                "name": "대위 홍길동",
                "group_idx": 1,
                "group_name": "육군",
                "belong": "00사령부",
                "level": 1,
                "profile_img": "28c72355244e81149080e4303a656d3e",
                "token": "1fsa2355244e81149080e4303a656d3e",
                "token_valid": "0000-00-00 00:00:00",
                "mdm_camera": 1,
                "mdm_mic": 0,
                "mdm_gps": 1,
                "mdm_wifi": 1,
                "mdm_hotspot": 1,
                "mdm_bluetooth": 1,
                "regdate": "2017-10-19T05:39:14.000Z"
            }
        } // 성공
        {"result": false, "msg": "authentication_required"} // 검증 권한이 없음
        {"result": false, "msg": "no_permission"} // 정책에 대한 권한이 없음
        {"result": false, "msg": "policy_verify_failed"} // 정책 검증 실패 (서버 오류)
        {"result": false, "msg": "policy_member_read_failed"} // 회원 정보 조회 실패 (서버 오류)
        ```

#### 업로드

- <code>POST</code> /upload - 프로필 이미지 업로드 API

    로그인되어 있을 경우 호출이 가능합니다.

    - 요청 DATA

        ```
        IMAGE_RAW_DATA
        ```

    - 응답 JSON

        ```
        {"result": true} // 성공
        {"result": false, "msg": "authentication_required"} // 로그인 되어 있지 않음
        {"result": false, "msg": "upload_server_error"} // 서버 에러
        {"result": false, "msg": "upload_img_exists"} // 이미 프로필 이미지가 있음
        {"result": false, "msg": "upload_failed"} // 업로드 실패 (서버 오류)
        {"result": false, "msg": "upload_wrong_image"} // 잘못된 이미지 업로드
        {"result": false, "msg": "upload_process_failed"} // 업로드 실패 (서버 오류)
        ```

- <code>GET</code> /upload/:profile_img - 프로필 이미지 다운로드 API

    PNG 포맷으로 이미지가 출력됩니다. (기본 프로필 이미지: :profile_img = 0)

    - 응답 DATA

        ```
        IMAGE_RAW_DATA
        ```

## 구조

    .
    ├── db
    │   ├── group.js           # 그룹 데이터베이스 SQL
    │   ├── index.js           # 데이터베이스 생성
    │   ├── member.js          # 회원 데이터베이스 SQL
    │   └── policy.js          # 정책 데이터베이스 SQL
    ├── .env                    # 서버 설정 파일
    ├── .gitignore
    ├── LICENSE
    ├── package.json
    ├── package-lock.json
    ├── README.md
    ├── routes
    │   ├── group.js           # 그룹 라우팅
    │   ├── member.js          # 회원 라우팅
    │   ├── policy.js          # 정책 라우팅
    │   └── upload.js          # 프로필 이미지 라우팅
    ├── schema.sql              # 데이터베이스 스키마 파일
    ├── server.js               # 서버 실행 파일
    └── uploads                 # 프로필 이미지 업로드 폴더
        └── profile.png         # 기본 프로필 이미지

## 라이센스

  [MIT](LICENSE)
