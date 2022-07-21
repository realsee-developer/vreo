import * as React from 'react'
import ReactDOM from 'react-dom'
import { FiveInitArgs, parseWork } from '@realsee/five'
import { createFiveProvider } from '@realsee/five/react'

// import { work } from './data/works/znRoyv06SZQeqA7m'

const work = {
    "_signature": "lkkbvGLbUBOGkLRCoVfWN6WNECtFD4cHlAiyA3O0kQtBE18p0kymYZgC+F7cCQAgCGZAnSaAZqgnZOJQtcqjUQDmoYkhrszGhlS4W1gzUVq6PxWvmysONiaf3qwa9En1Pi6iOeGNHDvzCAt+39eOPLlcCWCRXBoTM9xHXE1IPrg=",
    "allow_hosts": [
        "*"
    ],
    "base_url": "https://vrlab-public.ljcdn.com/",
    "certificate": "-----BEGIN CERTIFICATE-----\nMIIEMzCCAhsCCQDYAS/7ATZRmTANBgkqhkiG9w0BAQsFADCBkzELMAkGA1UEBhMC\nQ04xEDAOBgNVBAgMB0JlaWppbmcxEDAOBgNVBAcMB0JlaWppbmcxFDASBgNVBAoM\nC2xpYW5qaWEuY29tMRAwDgYDVQQLDAdSZWFsc2VlMREwDwYDVQQDDAhIYXJkd2Fy\nZTElMCMGCSqGSIb3DQEJARYWbml1aGFpcWluZ0BsaWFuamlhLmNvbTAeFw0yMTA5\nMTAwNTIwMDBaFw0zMTA5MDgwNTIwMDBaMIGmMQswCQYDVQQGEwJDTjEQMA4GA1UE\nCAwHQmVpSmluZzEQMA4GA1UEBwwHQmVpSmluZzEQMA4GA1UECgwHUmVhbHNlZTEZ\nMBcGA1UECwwQUmVhbHNlZUFwcEdldHdheTEgMB4GA1UEAwwXYXBwLWdhdGV3YXku\ncmVhbHNlZS5jb20xJDAiBgkqhkiG9w0BCQEWFWRldmVsb3BlckByZWFsc2VlLmNv\nbTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAuv/y3Ezsy/wh3LCA8vomPbgI\nSO9iO5kyR+oAetklD+epMU6J/ZbvTDEomZxuS5iyyKGBupzAh2ZFLIy7tsE71Vx1\nIIvT7Kdyq66lMU4YzdrpKUcxv7oOQnO8DA1orKluNa4jkyXBywHKs/Q+20LVc+RD\ngKXqFGJUdo8mAxEScs0CAwEAATANBgkqhkiG9w0BAQsFAAOCAgEAkMxsU4VLPd4J\n0rElBNBIyqPtvnlTs6VkhIK0l4oM58wtDKc1uG9UPSX5j29NguZM6LOe0jCsU2Vg\nEpUseMWQjx4o2yBg7MokQyjWc1zu6PppKhQ+RqHQy/biJ2zsIMpX3oMASXffvnW5\nn4Bjyo1JdDJiLm1fLvLlVVxQoraJD+rtpqWDEYixGVREUo5OIL5Y5dVjkHG2r9RQ\nQuu3yEiyr9gAW8yhz3YR6/sJ6boyGK8NC0v8Jih7NnCdT+9ML+3jn3P5F3TeXdSf\nVeYIm5oWAOTe3AjjKP8ARMb2RYACjg80/AcowD/dvRRjbwQmyucUNug2pXJynXpD\nNfx1IBmUmzSAT1Z5yNuY/f3VRBJvmIQ6Jpmef+g0/wUJpyS4SObguItyYlFPLqRH\nK1oKqNX/uV0GWWEQl6Lml986TzlHxc4ljtHBhjzlKYIYYZLWWipk4JiB8hxJcTK+\ncrgvclEQSxFlmAyoqxYFClrOOsPqZJdBhDTvoUWnnWuJLQt7DLHpyInp+S75Gg3o\n0zgHpt9m26B3YbjQGYMQlYmhl2VLQa+Ey0W8UZQXLcTvoRT4p+8crqr6cNNsxCyZ\nm08vBbEMIMvhBeLQvpM75oaMBmelegipFl2eelxVIHdGJWoyJSZQUdXN0uSidhZp\nI7AIgzhqK1Ku/IXK0OSXJonn+/9X/VI=\n-----END CERTIFICATE-----",
    "create_time": "2022-03-16 20:22:26",
    "expire_at": "1973650213522",
    "initial": {
        "fov": 60,
        "latitude": 0,
        "longitude": 2.7019578065358587,
        "pano_index": 9,
        "recordVideo": false
    },
    "model": {
        "file_url": "vrframework/release/ue4_decoration_plan/Bn0LAn97BUvwGoM7/vrproc-ue4/render/model.at3d",
        "material_base_url": "https://vrlab-public.ljcdn.com/",
        "material_textures": [
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_0.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_1.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_2.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_3.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_4.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_5.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_6.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_7.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_8.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_9.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_10.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_11.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_12.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_13.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_14.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_15.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_16.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_17.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_18.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_19.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_20.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_21.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_22.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_23.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_24.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_25.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_26.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_27.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_28.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_29.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_30.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_31.jpg",
            "release/ue4/60366bc71ddd26f621c41aaad3e750d4/at3d_results/texture_32.jpg"
        ]
    },
    "observers": [
        {
            "accessible_nodes": [
                1,
                8,
                9
            ],
            "direction": null,
            "fov": null,
            "index": 0,
            "position": [
                -5.817983,
                1.2,
                -10.477632
            ],
            "quaternion": {
                "w": 0.7071067811865475,
                "x": 0,
                "y": 0.7071067811865475,
                "z": 0
            },
            "room_name": "客厅",
            "standing_position": [
                -5.817983,
                0,
                -10.477632
            ],
            "visible_nodes": [
                1,
                8,
                9
            ]
        },
        {
            "accessible_nodes": [
                0,
                2,
                4,
                5,
                6,
                8,
                9,
                13,
                16
            ],
            "direction": null,
            "fov": null,
            "index": 1,
            "position": [
                -5.814032,
                1.2,
                -8.898182
            ],
            "quaternion": {
                "w": 0.7071067811865475,
                "x": 0,
                "y": 0.7071067811865475,
                "z": 0
            },
            "room_name": "客厅",
            "standing_position": [
                -5.814032,
                0,
                -8.898182
            ],
            "visible_nodes": [
                0,
                2,
                4,
                5,
                6,
                8,
                9,
                13,
                16
            ]
        },
        {
            "accessible_nodes": [
                1,
                3,
                4,
                5,
                6
            ],
            "direction": null,
            "fov": null,
            "index": 2,
            "position": [
                -4.266667,
                1.2,
                -8.878948
            ],
            "quaternion": {
                "w": 0.7071067811865475,
                "x": 0,
                "y": 0.7071067811865475,
                "z": 0
            },
            "room_name": "过道",
            "standing_position": [
                -4.266667,
                0,
                -8.878948
            ],
            "visible_nodes": [
                1,
                3,
                4,
                5,
                6
            ]
        },
        {
            "accessible_nodes": [
                2
            ],
            "direction": null,
            "fov": null,
            "index": 3,
            "position": [
                -4.345176,
                1.2,
                -10.514036
            ],
            "quaternion": {
                "w": 0.7071067811865475,
                "x": 0,
                "y": 0.7071067811865475,
                "z": 0
            },
            "room_name": "卫生间",
            "standing_position": [
                -4.345176,
                0,
                -10.514036
            ],
            "visible_nodes": [
                2
            ]
        },
        {
            "accessible_nodes": [
                1,
                2,
                5,
                6
            ],
            "direction": null,
            "fov": null,
            "index": 4,
            "position": [
                -3.184212,
                1.2,
                -8.875439
            ],
            "quaternion": {
                "w": 0.7071067811865475,
                "x": 0,
                "y": 0.7071067811865475,
                "z": 0
            },
            "room_name": "过道",
            "standing_position": [
                -3.184212,
                0,
                -8.875439
            ],
            "visible_nodes": [
                1,
                2,
                5,
                6
            ]
        },
        {
            "accessible_nodes": [
                1,
                2,
                4,
                6,
                7
            ],
            "direction": null,
            "fov": null,
            "index": 5,
            "position": [
                -2.157019,
                1.2,
                -8.875439
            ],
            "quaternion": {
                "w": 0.7071067811865475,
                "x": 0,
                "y": 0.7071067811865475,
                "z": 0
            },
            "room_name": "卧室B",
            "standing_position": [
                -2.157019,
                0,
                -8.875439
            ],
            "visible_nodes": [
                1,
                2,
                4,
                6,
                7
            ]
        },
        {
            "accessible_nodes": [
                1,
                2,
                4,
                5,
                7
            ],
            "direction": null,
            "fov": null,
            "index": 6,
            "position": [
                -1.020176,
                1.2,
                -9.232013
            ],
            "quaternion": {
                "w": 0.7071067811865475,
                "x": 0,
                "y": 0.7071067811865475,
                "z": 0
            },
            "room_name": "卧室B",
            "standing_position": [
                -1.020176,
                0,
                -9.232013
            ],
            "visible_nodes": [
                1,
                2,
                4,
                5,
                7
            ]
        },
        {
            "accessible_nodes": [
                5,
                6
            ],
            "direction": null,
            "fov": null,
            "index": 7,
            "position": [
                -2.229386,
                1.2,
                -10.110956
            ],
            "quaternion": {
                "w": 0.7071067811865475,
                "x": 0,
                "y": 0.7071067811865475,
                "z": 0
            },
            "room_name": "卧室B",
            "standing_position": [
                -2.229386,
                0,
                -10.110956
            ],
            "visible_nodes": [
                5,
                6
            ]
        },
        {
            "accessible_nodes": [
                0,
                1,
                9,
                10,
                11,
                13,
                15,
                16
            ],
            "direction": null,
            "fov": null,
            "index": 8,
            "position": [
                -5.836843,
                1.2,
                -7.649124
            ],
            "quaternion": {
                "w": 0.7071067811865475,
                "x": 0,
                "y": 0.7071067811865475,
                "z": 0
            },
            "room_name": "客厅",
            "standing_position": [
                -5.836843,
                0,
                -7.649124
            ],
            "visible_nodes": [
                0,
                1,
                9,
                10,
                11,
                13,
                15,
                16
            ]
        },
        {
            "accessible_nodes": [
                0,
                1,
                8,
                10,
                11,
                12,
                13,
                14,
                16,
                17
            ],
            "direction": [
                -0.425609,
                0,
                0.904907
            ],
            "fov": 60,
            "index": 9,
            "position": [
                -6.442983,
                1.2,
                -6.508334
            ],
            "quaternion": {
                "w": 0.7071067811865475,
                "x": 0,
                "y": 0.7071067811865475,
                "z": 0
            },
            "room_name": "客厅",
            "standing_position": [
                -6.442983,
                0,
                -6.508334
            ],
            "visible_nodes": [
                0,
                1,
                8,
                10,
                11,
                12,
                13,
                14,
                16,
                17
            ]
        },
        {
            "accessible_nodes": [
                8,
                9,
                11,
                16
            ],
            "direction": null,
            "fov": null,
            "index": 10,
            "position": [
                -4.669342,
                1.2,
                -7.143407
            ],
            "quaternion": {
                "w": 0.7071067811865475,
                "x": 0,
                "y": 0.7071067811865475,
                "z": 0
            },
            "room_name": "厨房",
            "standing_position": [
                -4.669342,
                0,
                -7.143407
            ],
            "visible_nodes": [
                8,
                9,
                11,
                16
            ]
        },
        {
            "accessible_nodes": [
                8,
                9,
                10
            ],
            "direction": null,
            "fov": null,
            "index": 11,
            "position": [
                -3.458335,
                1.2,
                -7.150878
            ],
            "quaternion": {
                "w": 0.7071067811865475,
                "x": 0,
                "y": 0.7071067811865475,
                "z": 0
            },
            "room_name": "厨房",
            "standing_position": [
                -3.458335,
                0,
                -7.150878
            ],
            "visible_nodes": [
                8,
                9,
                10
            ]
        },
        {
            "accessible_nodes": [
                9,
                15,
                16,
                17
            ],
            "direction": null,
            "fov": null,
            "index": 12,
            "position": [
                -4.650825,
                1.2,
                -5.866232
            ],
            "quaternion": {
                "w": 0.7071067811865475,
                "x": 0,
                "y": 0.7071067811865475,
                "z": 0
            },
            "room_name": "卧室A",
            "standing_position": [
                -4.650825,
                0,
                -5.866232
            ],
            "visible_nodes": [
                9,
                15,
                16,
                17
            ]
        },
        {
            "accessible_nodes": [
                1,
                8,
                9,
                14,
                16
            ],
            "direction": null,
            "fov": null,
            "index": 13,
            "position": [
                -5.860088,
                1.2,
                -4.286846
            ],
            "quaternion": {
                "w": 0.7071067811865475,
                "x": 0,
                "y": 0.7071067811865475,
                "z": 0
            },
            "room_name": "客厅",
            "standing_position": [
                -5.860088,
                0,
                -4.286846
            ],
            "visible_nodes": [
                1,
                8,
                9,
                14,
                16
            ]
        },
        {
            "accessible_nodes": [
                9,
                13,
                16
            ],
            "direction": null,
            "fov": null,
            "index": 14,
            "position": [
                -6.432457,
                1.2,
                -2.605267
            ],
            "quaternion": {
                "w": 0.7071067811865475,
                "x": 0,
                "y": 0.7071067811865475,
                "z": 0
            },
            "room_name": "客厅",
            "standing_position": [
                -6.432457,
                0,
                -2.605267
            ],
            "visible_nodes": [
                9,
                13,
                16
            ]
        },
        {
            "accessible_nodes": [
                8,
                12,
                17
            ],
            "direction": null,
            "fov": null,
            "index": 15,
            "position": [
                -4.402882,
                1.2,
                -4.097522
            ],
            "quaternion": {
                "w": 0.7071067811865475,
                "x": 0,
                "y": 0.7071067811865475,
                "z": 0
            },
            "room_name": "卧室A",
            "standing_position": [
                -4.402882,
                0,
                -4.097522
            ],
            "visible_nodes": [
                8,
                12,
                17
            ]
        },
        {
            "accessible_nodes": [
                1,
                8,
                9,
                12,
                13,
                14
            ],
            "direction": null,
            "fov": null,
            "index": 16,
            "position": [
                -7.432895,
                1.2,
                -4.316671
            ],
            "quaternion": {
                "w": 0.7071067811865475,
                "x": 0,
                "y": 0.7071067811865475,
                "z": 0
            },
            "room_name": "客厅",
            "standing_position": [
                -7.432895,
                0,
                -4.316671
            ],
            "visible_nodes": [
                1,
                8,
                9,
                12,
                13,
                14
            ]
        },
        {
            "accessible_nodes": [
                9,
                12,
                15
            ],
            "direction": null,
            "fov": null,
            "index": 17,
            "position": [
                -2.947366,
                1.2,
                -5.514849
            ],
            "quaternion": {
                "w": 0.7071067811865475,
                "x": 0,
                "y": 0.7071067811865475,
                "z": 0
            },
            "room_name": "卧室A",
            "standing_position": [
                -2.947366,
                0,
                -5.514849
            ],
            "visible_nodes": [
                9,
                12,
                15
            ]
        }
    ],
    "panorama": {
        "count": 18,
        "list": [
            {
                "back": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/0/0_b.jpg",
                "down": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/0/0_d.jpg",
                "front": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/0/0_f.jpg",
                "index": 0,
                "left": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/0/0_l.jpg",
                "right": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/0/0_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/0/0_u.jpg"
            },
            {
                "back": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/1/1_b.jpg",
                "down": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/1/1_d.jpg",
                "front": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/1/1_f.jpg",
                "index": 1,
                "left": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/1/1_l.jpg",
                "right": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/1/1_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/1/1_u.jpg"
            },
            {
                "back": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/2/2_b.jpg",
                "down": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/2/2_d.jpg",
                "front": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/2/2_f.jpg",
                "index": 2,
                "left": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/2/2_l.jpg",
                "right": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/2/2_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/2/2_u.jpg"
            },
            {
                "back": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/3/3_b.jpg",
                "down": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/3/3_d.jpg",
                "front": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/3/3_f.jpg",
                "index": 3,
                "left": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/3/3_l.jpg",
                "right": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/3/3_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/3/3_u.jpg"
            },
            {
                "back": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/4/4_b.jpg",
                "down": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/4/4_d.jpg",
                "front": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/4/4_f.jpg",
                "index": 4,
                "left": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/4/4_l.jpg",
                "right": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/4/4_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/4/4_u.jpg"
            },
            {
                "back": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/5/5_b.jpg",
                "down": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/5/5_d.jpg",
                "front": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/5/5_f.jpg",
                "index": 5,
                "left": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/5/5_l.jpg",
                "right": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/5/5_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/5/5_u.jpg"
            },
            {
                "back": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/6/6_b.jpg",
                "down": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/6/6_d.jpg",
                "front": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/6/6_f.jpg",
                "index": 6,
                "left": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/6/6_l.jpg",
                "right": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/6/6_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/6/6_u.jpg"
            },
            {
                "back": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/7/7_b.jpg",
                "down": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/7/7_d.jpg",
                "front": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/7/7_f.jpg",
                "index": 7,
                "left": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/7/7_l.jpg",
                "right": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/7/7_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/7/7_u.jpg"
            },
            {
                "back": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/8/8_b.jpg",
                "down": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/8/8_d.jpg",
                "front": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/8/8_f.jpg",
                "index": 8,
                "left": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/8/8_l.jpg",
                "right": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/8/8_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/8/8_u.jpg"
            },
            {
                "back": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/9/9_b.jpg",
                "down": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/9/9_d.jpg",
                "front": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/9/9_f.jpg",
                "index": 9,
                "left": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/9/9_l.jpg",
                "right": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/9/9_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/9/9_u.jpg"
            },
            {
                "back": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/10/10_b.jpg",
                "down": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/10/10_d.jpg",
                "front": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/10/10_f.jpg",
                "index": 10,
                "left": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/10/10_l.jpg",
                "right": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/10/10_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/10/10_u.jpg"
            },
            {
                "back": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/11/11_b.jpg",
                "down": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/11/11_d.jpg",
                "front": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/11/11_f.jpg",
                "index": 11,
                "left": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/11/11_l.jpg",
                "right": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/11/11_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/11/11_u.jpg"
            },
            {
                "back": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/12/12_b.jpg",
                "down": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/12/12_d.jpg",
                "front": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/12/12_f.jpg",
                "index": 12,
                "left": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/12/12_l.jpg",
                "right": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/12/12_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/12/12_u.jpg"
            },
            {
                "back": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/13/13_b.jpg",
                "down": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/13/13_d.jpg",
                "front": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/13/13_f.jpg",
                "index": 13,
                "left": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/13/13_l.jpg",
                "right": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/13/13_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/13/13_u.jpg"
            },
            {
                "back": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/14/14_b.jpg",
                "down": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/14/14_d.jpg",
                "front": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/14/14_f.jpg",
                "index": 14,
                "left": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/14/14_l.jpg",
                "right": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/14/14_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/14/14_u.jpg"
            },
            {
                "back": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/15/15_b.jpg",
                "down": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/15/15_d.jpg",
                "front": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/15/15_f.jpg",
                "index": 15,
                "left": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/15/15_l.jpg",
                "right": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/15/15_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/15/15_u.jpg"
            },
            {
                "back": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/16/16_b.jpg",
                "down": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/16/16_d.jpg",
                "front": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/16/16_f.jpg",
                "index": 16,
                "left": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/16/16_l.jpg",
                "right": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/16/16_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/16/16_u.jpg"
            },
            {
                "back": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/17/17_b.jpg",
                "down": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/17/17_d.jpg",
                "front": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/17/17_f.jpg",
                "index": 17,
                "left": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/17/17_l.jpg",
                "right": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/17/17_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "release/ue4/6f1682e24a31c472484e0eac8de8a702/ue4_result/cube_2048/17/17_u.jpg"
            }
        ]
    },
    "picture_url": "vrframework/release/ue4_decoration_plan/Bn0LAn97BUvwGoM7/vrproc-ue4/render/picture.jpg",
    "update_time": "2022-06-21 14:32:24",
    "vr_code": "82Kg061prXoEjeAbJX"
}

// import { work } from './data/works/81W5PlyWbZ5I9g3Nj7'

import { ResponsiveFullScreenFiveCanvas } from './components/ResponsiveFullScreenFiveCanvas'

import { App } from './App'

import './index.css'

import '../stylesheets/default.css'

const defaultInitArgs: FiveInitArgs = {
  imageOptions: { size: 1024 },
  textureOptions: { size: 64 },
  onlyRenderIfNeeds: true,
  antialias: false,
  model: {},
  plugins: [],
}

const FiveProvider = createFiveProvider(defaultInitArgs)

ReactDOM.render(
  <React.StrictMode>
      <FiveProvider initialWork={parseWork(work)} ref={(ref) => Object.assign(window, { $five: ref?.five })}>
          <ResponsiveFullScreenFiveCanvas />
          <App />
      </FiveProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
