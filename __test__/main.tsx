import * as React from 'react'
import ReactDOM from 'react-dom'
import { FiveInitArgs, parseWork } from '@realsee/five'
import { createFiveProvider } from '@realsee/five/react'

// import { work } from './data/works/znRoyv06SZQeqA7m'

const work = {
    "_signature": "DuDWUQ//kHGnXdRfmalS0R1uZvNDmTIqjJ/ZZk+1UVfO5C3NlzpjsybxiSCAe+ahy6hpokUFjjcoplICXSWd/WaE+woSRkfgkZmhQ3AN+LOovti5mk5pplTcURPhFvg1zMSBIOOgz/l+jsF1rScYgiwsgAvPHXP+VpusncNcVN4=",
    "allow_hosts": [
        "*"
    ],
    "base_url": "https://vrlab-public.ljcdn.com/release/auto3dhd/07f8f1f75da72e0432344652710024ed/",
    "certificate": "-----BEGIN CERTIFICATE-----\nMIIEMzCCAhsCCQDYAS/7ATZRmTANBgkqhkiG9w0BAQsFADCBkzELMAkGA1UEBhMC\nQ04xEDAOBgNVBAgMB0JlaWppbmcxEDAOBgNVBAcMB0JlaWppbmcxFDASBgNVBAoM\nC2xpYW5qaWEuY29tMRAwDgYDVQQLDAdSZWFsc2VlMREwDwYDVQQDDAhIYXJkd2Fy\nZTElMCMGCSqGSIb3DQEJARYWbml1aGFpcWluZ0BsaWFuamlhLmNvbTAeFw0yMTA5\nMTAwNTIwMDBaFw0zMTA5MDgwNTIwMDBaMIGmMQswCQYDVQQGEwJDTjEQMA4GA1UE\nCAwHQmVpSmluZzEQMA4GA1UEBwwHQmVpSmluZzEQMA4GA1UECgwHUmVhbHNlZTEZ\nMBcGA1UECwwQUmVhbHNlZUFwcEdldHdheTEgMB4GA1UEAwwXYXBwLWdhdGV3YXku\ncmVhbHNlZS5jb20xJDAiBgkqhkiG9w0BCQEWFWRldmVsb3BlckByZWFsc2VlLmNv\nbTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAuv/y3Ezsy/wh3LCA8vomPbgI\nSO9iO5kyR+oAetklD+epMU6J/ZbvTDEomZxuS5iyyKGBupzAh2ZFLIy7tsE71Vx1\nIIvT7Kdyq66lMU4YzdrpKUcxv7oOQnO8DA1orKluNa4jkyXBywHKs/Q+20LVc+RD\ngKXqFGJUdo8mAxEScs0CAwEAATANBgkqhkiG9w0BAQsFAAOCAgEAkMxsU4VLPd4J\n0rElBNBIyqPtvnlTs6VkhIK0l4oM58wtDKc1uG9UPSX5j29NguZM6LOe0jCsU2Vg\nEpUseMWQjx4o2yBg7MokQyjWc1zu6PppKhQ+RqHQy/biJ2zsIMpX3oMASXffvnW5\nn4Bjyo1JdDJiLm1fLvLlVVxQoraJD+rtpqWDEYixGVREUo5OIL5Y5dVjkHG2r9RQ\nQuu3yEiyr9gAW8yhz3YR6/sJ6boyGK8NC0v8Jih7NnCdT+9ML+3jn3P5F3TeXdSf\nVeYIm5oWAOTe3AjjKP8ARMb2RYACjg80/AcowD/dvRRjbwQmyucUNug2pXJynXpD\nNfx1IBmUmzSAT1Z5yNuY/f3VRBJvmIQ6Jpmef+g0/wUJpyS4SObguItyYlFPLqRH\nK1oKqNX/uV0GWWEQl6Lml986TzlHxc4ljtHBhjzlKYIYYZLWWipk4JiB8hxJcTK+\ncrgvclEQSxFlmAyoqxYFClrOOsPqZJdBhDTvoUWnnWuJLQt7DLHpyInp+S75Gg3o\n0zgHpt9m26B3YbjQGYMQlYmhl2VLQa+Ey0W8UZQXLcTvoRT4p+8crqr6cNNsxCyZ\nm08vBbEMIMvhBeLQvpM75oaMBmelegipFl2eelxVIHdGJWoyJSZQUdXN0uSidhZp\nI7AIgzhqK1Ku/IXK0OSXJonn+/9X/VI=\n-----END CERTIFICATE-----",
    "create_time": "2022-01-13T16:10:31+08:00",
    "expire_at": "1973595411686",
    "initial": {
        "flag_position": [
            -3.1458191345482023,
            -1.3773701134582648,
            -0.5960176429449496
        ],
        "fov": 95,
        "heading": 0,
        "latitude": 0,
        "longitude": 1.1111111111111178,
        "pano": 1,
        "pano_index": 1
    },
    "model": {
        "file_url": "model/auto3d-3JOY5nzIB2qoGazpr-C2aA.at3d",
        "material_base_url": "materials/",
        "material_textures": [
            "texture_0.jpg",
            "texture_1.jpg",
            "texture_2.jpg"
        ],
        "modify_time": "2022-01-13T16:22:16+08:00",
        "type": 0
    },
    "observers": [
        {
            "accessible_nodes": [
                1,
                2,
                3,
                4,
                5,
                9
            ],
            "floor_index": 0,
            "index": 0,
            "offset_point_count": 0,
            "position": [
                0.33197999000549316,
                -0.003061810042709112,
                -0.10047200322151184
            ],
            "quaternion": {
                "w": -0.18055217092805298,
                "x": -0.0037380378275479746,
                "y": -0.983551801373293,
                "z": -0.0035769112922732957
            },
            "standing_position": [
                0.33197999000549316,
                -1.3800978892181028,
                -0.10047200322151184
            ],
            "visible_nodes": [
                1,
                2,
                3,
                4,
                5,
                9
            ]
        },
        {
            "accessible_nodes": [
                0,
                2,
                3,
                5
            ],
            "floor_index": 0,
            "index": 1,
            "offset_point_count": 0,
            "position": [
                -0.34815001487731934,
                -0.013308700174093246,
                -0.48179200291633606
            ],
            "quaternion": {
                "w": 0.1505303856843812,
                "x": -0.00663748082676651,
                "y": -0.9885790380013559,
                "z": -0.002836963888291452
            },
            "standing_position": [
                -0.34815001487731934,
                -1.3773701134582648,
                -0.48179200291633606
            ],
            "visible_nodes": [
                0,
                2,
                3,
                5
            ]
        },
        {
            "accessible_nodes": [
                0,
                1,
                3,
                5
            ],
            "floor_index": 0,
            "index": 2,
            "offset_point_count": 0,
            "position": [
                -1.8728200197219849,
                0.000016324200259987265,
                -1.421929955482483
            ],
            "quaternion": {
                "w": 0.35570882158441575,
                "x": -0.0020593733815345286,
                "y": -0.9345939896313765,
                "z": 0.0010353812580289957
            },
            "standing_position": [
                -1.8728200197219849,
                -1.3829621363782778,
                -1.421929955482483
            ],
            "visible_nodes": [
                0,
                1,
                3,
                5
            ]
        },
        {
            "accessible_nodes": [
                0,
                1,
                2
            ],
            "floor_index": 0,
            "index": 3,
            "offset_point_count": 0,
            "position": [
                -3.017780065536499,
                0.0042768800631165504,
                -1.5581200122833252
            ],
            "quaternion": {
                "w": 0.8442526456711992,
                "x": -0.0032363817898408654,
                "y": -0.5359355932040535,
                "z": -0.00025682307857330156
            },
            "standing_position": [
                -3.017780065536499,
                -1.364597229579101,
                -1.5581200122833252
            ],
            "visible_nodes": [
                0,
                1,
                2
            ]
        },
        {
            "accessible_nodes": [
                0,
                5,
                6,
                7,
                8,
                9
            ],
            "floor_index": 0,
            "index": 4,
            "offset_point_count": 0,
            "position": [
                0.6979849934577942,
                -0.008064149878919125,
                1.075369954109192
            ],
            "quaternion": {
                "w": -0.995833733224722,
                "x": -0.0021051665084538245,
                "y": 0.09102500593157843,
                "z": -0.00502056719892848
            },
            "standing_position": [
                0.6979849934577942,
                -1.3778526212689652,
                1.075369954109192
            ],
            "visible_nodes": [
                0,
                5,
                6,
                7,
                8,
                9
            ]
        },
        {
            "accessible_nodes": [
                0,
                1,
                2,
                4,
                6,
                7,
                8
            ],
            "floor_index": 0,
            "index": 5,
            "offset_point_count": 0,
            "position": [
                1.5307300090789795,
                0.039181899279356,
                1.1970700025558472
            ],
            "quaternion": {
                "w": -0.869760450880415,
                "x": -0.0007271134660639243,
                "y": -0.4934498913663824,
                "z": -0.004840980398982319
            },
            "standing_position": [
                1.5307300090789795,
                -1.3310003570956335,
                1.1970700025558472
            ],
            "visible_nodes": [
                0,
                1,
                2,
                4,
                6,
                7,
                8
            ]
        },
        {
            "accessible_nodes": [
                4,
                5,
                7,
                8
            ],
            "floor_index": 0,
            "index": 6,
            "offset_point_count": 0,
            "position": [
                2.435610055923462,
                0.007634690031409264,
                1.1920599937438965
            ],
            "quaternion": {
                "w": -0.9374750054524362,
                "x": -0.00026984512013194633,
                "y": -0.34804196024200884,
                "z": -0.002706769872162383
            },
            "standing_position": [
                2.435610055923462,
                -1.3358636256229035,
                1.1920599937438965
            ],
            "visible_nodes": [
                4,
                5,
                7,
                8
            ]
        },
        {
            "accessible_nodes": [
                4,
                5,
                6,
                8
            ],
            "floor_index": 0,
            "index": 7,
            "offset_point_count": 0,
            "position": [
                -0.31459999084472656,
                -0.015475300140678883,
                1.069100022315979
            ],
            "quaternion": {
                "w": 0.525310257193064,
                "x": -0.004560913889849991,
                "y": -0.8508968770364367,
                "z": -0.0016870115197632897
            },
            "standing_position": [
                -0.31459999084472656,
                -1.3778427104853856,
                1.069100022315979
            ],
            "visible_nodes": [
                4,
                5,
                6,
                8
            ]
        },
        {
            "accessible_nodes": [
                4,
                5,
                6,
                7
            ],
            "floor_index": 0,
            "index": 8,
            "offset_point_count": 0,
            "position": [
                -1.3395899534225464,
                -0.01744779944419861,
                1.2498600482940674
            ],
            "quaternion": {
                "w": 0.4506126721980357,
                "x": -0.000998484162340085,
                "y": -0.8927177804085741,
                "z": -0.0014792803548992466
            },
            "standing_position": [
                -1.3395899534225464,
                -1.3737724597895036,
                1.2498600482940674
            ],
            "visible_nodes": [
                4,
                5,
                6,
                7
            ]
        },
        {
            "accessible_nodes": [
                0,
                4,
                10,
                11,
                12
            ],
            "floor_index": 0,
            "index": 9,
            "offset_point_count": 0,
            "position": [
                0.8404499888420105,
                -0.024894600734114647,
                2.5813701152801514
            ],
            "quaternion": {
                "w": -0.9320776692012146,
                "x": -0.0016224076835032596,
                "y": -0.3622507435601027,
                "z": -0.0017253145927353436
            },
            "standing_position": [
                0.8404499888420105,
                -1.382846569834136,
                2.5813701152801514
            ],
            "visible_nodes": [
                0,
                4,
                10,
                11,
                12
            ]
        },
        {
            "accessible_nodes": [
                9,
                11
            ],
            "floor_index": 0,
            "index": 10,
            "offset_point_count": 0,
            "position": [
                -0.3952229917049408,
                -0.02519409917294979,
                3.1922099590301514
            ],
            "quaternion": {
                "w": 0.6097371624859363,
                "x": -0.002086571963460957,
                "y": -0.7926003723255918,
                "z": 0.0009407523833058105
            },
            "standing_position": [
                -0.3952229917049408,
                -1.3805747559765429,
                3.1922099590301514
            ],
            "visible_nodes": [
                9,
                11
            ]
        },
        {
            "accessible_nodes": [
                9,
                10
            ],
            "floor_index": 0,
            "index": 11,
            "offset_point_count": 0,
            "position": [
                -1.310189962387085,
                -0.021937400102615356,
                3.61680006980896
            ],
            "quaternion": {
                "w": 0.8411014473834825,
                "x": -0.0018705131188144286,
                "y": -0.5408594890827443,
                "z": 0.003980024357562681
            },
            "standing_position": [
                -1.310189962387085,
                -1.3841193964579384,
                3.61680006980896
            ],
            "visible_nodes": [
                9,
                10
            ]
        },
        {
            "accessible_nodes": [
                9,
                13,
                14,
                15,
                16
            ],
            "floor_index": 0,
            "index": 12,
            "offset_point_count": 0,
            "position": [
                1.7066700458526611,
                -0.016441499814391136,
                3.4214301109313965
            ],
            "quaternion": {
                "w": -0.9999670008340638,
                "x": 0.003716540231021345,
                "y": 0.00716339151139928,
                "z": 0.0009354964627954934
            },
            "standing_position": [
                1.7066700458526611,
                -1.387733479857243,
                3.4214301109313965
            ],
            "visible_nodes": [
                9,
                13,
                14,
                15,
                16
            ]
        },
        {
            "accessible_nodes": [
                12,
                14,
                15,
                16
            ],
            "floor_index": 0,
            "index": 13,
            "offset_point_count": 0,
            "position": [
                1.530769944190979,
                -0.030100500211119652,
                4.17140007019043
            ],
            "quaternion": {
                "w": -0.8820608787864999,
                "x": -0.0020757301978352916,
                "y": 0.4711308445521599,
                "z": -0.000011311501966412625
            },
            "standing_position": [
                1.530769944190979,
                -1.3921472378232977,
                4.17140007019043
            ],
            "visible_nodes": [
                12,
                14,
                15,
                16
            ]
        },
        {
            "accessible_nodes": [
                12,
                13,
                15,
                16
            ],
            "floor_index": 0,
            "index": 14,
            "offset_point_count": 0,
            "position": [
                1.0009299516677856,
                -0.026723399758338928,
                4.717299938201904
            ],
            "quaternion": {
                "w": -0.9459386753595446,
                "x": -0.00010240118968214064,
                "y": 0.3243455237287464,
                "z": -0.00001338014973698946
            },
            "standing_position": [
                1.0009299516677856,
                -1.3882904424378013,
                4.717299938201904
            ],
            "visible_nodes": [
                12,
                13,
                15,
                16
            ]
        },
        {
            "accessible_nodes": [
                12,
                13,
                14,
                16
            ],
            "floor_index": 0,
            "index": 15,
            "offset_point_count": 0,
            "position": [
                1.2965500354766846,
                -0.026505200192332268,
                6.090849876403809
            ],
            "quaternion": {
                "w": -0.9923416303330603,
                "x": -0.0002701890533645808,
                "y": 0.12351846522724871,
                "z": 0.0011001431031616722
            },
            "standing_position": [
                1.2965500354766846,
                -1.3754673360734195,
                6.090849876403809
            ],
            "visible_nodes": [
                12,
                13,
                14,
                16
            ]
        },
        {
            "accessible_nodes": [
                12,
                13,
                14,
                15
            ],
            "floor_index": 0,
            "index": 16,
            "offset_point_count": 0,
            "position": [
                1.8197499513626099,
                -0.00894881971180439,
                7.077640056610107
            ],
            "quaternion": {
                "w": -0.8663004298895683,
                "x": 0.0039181859756822505,
                "y": -0.4995078152804631,
                "z": -0.0003860777917497016
            },
            "standing_position": [
                1.8197499513626099,
                -1.3789780864766055,
                7.077640056610107
            ],
            "visible_nodes": [
                12,
                13,
                14,
                15
            ]
        }
    ],
    "panorama": {
        "count": 17,
        "list": [
            {
                "back": "images/cube_2048/0/2f7f5a022b088ea3757c4fb659491d88/0_b.jpg",
                "down": "images/cube_2048/0/2f7f5a022b088ea3757c4fb659491d88/0_d.jpg",
                "front": "images/cube_2048/0/2f7f5a022b088ea3757c4fb659491d88/0_f_loPeet.jpg",
                "index": 0,
                "left": "images/cube_2048/0/2f7f5a022b088ea3757c4fb659491d88/0_l.jpg",
                "right": "images/cube_2048/0/2f7f5a022b088ea3757c4fb659491d88/0_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "images/cube_2048/0/2f7f5a022b088ea3757c4fb659491d88/0_u.jpg"
            },
            {
                "back": "images/cube_2048/1/513b86cc7279d161097b7c10024f18e0/1_b_LNvuSe.jpg",
                "down": "images/cube_2048/1/513b86cc7279d161097b7c10024f18e0/1_d.jpg",
                "front": "images/cube_2048/1/513b86cc7279d161097b7c10024f18e0/1_f.jpg",
                "index": 1,
                "left": "images/cube_2048/1/513b86cc7279d161097b7c10024f18e0/1_l.jpg",
                "right": "images/cube_2048/1/513b86cc7279d161097b7c10024f18e0/1_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "images/cube_2048/1/513b86cc7279d161097b7c10024f18e0/1_u.jpg"
            },
            {
                "back": "images/cube_2048/2/85f1e003ea7c4c3585e189cb48aa9fc2/2_b.jpg",
                "down": "images/cube_2048/2/85f1e003ea7c4c3585e189cb48aa9fc2/2_d.jpg",
                "front": "images/cube_2048/2/85f1e003ea7c4c3585e189cb48aa9fc2/2_f.jpg",
                "index": 2,
                "left": "images/cube_2048/2/85f1e003ea7c4c3585e189cb48aa9fc2/2_l.jpg",
                "right": "images/cube_2048/2/85f1e003ea7c4c3585e189cb48aa9fc2/2_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "images/cube_2048/2/85f1e003ea7c4c3585e189cb48aa9fc2/2_u.jpg"
            },
            {
                "back": "images/cube_2048/3/7feab2c37469b2b152c89c8745900817/3_b.jpg",
                "down": "images/cube_2048/3/7feab2c37469b2b152c89c8745900817/3_d.jpg",
                "front": "images/cube_2048/3/7feab2c37469b2b152c89c8745900817/3_f.jpg",
                "index": 3,
                "left": "images/cube_2048/3/7feab2c37469b2b152c89c8745900817/3_l.jpg",
                "right": "images/cube_2048/3/7feab2c37469b2b152c89c8745900817/3_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "images/cube_2048/3/7feab2c37469b2b152c89c8745900817/3_u.jpg"
            },
            {
                "back": "images/cube_2048/4/23299cf008f59d4d48cea2b290b2d4d0/4_b.jpg",
                "down": "images/cube_2048/4/23299cf008f59d4d48cea2b290b2d4d0/4_d.jpg",
                "front": "images/cube_2048/4/23299cf008f59d4d48cea2b290b2d4d0/4_f.jpg",
                "index": 4,
                "left": "images/cube_2048/4/23299cf008f59d4d48cea2b290b2d4d0/4_l.jpg",
                "right": "images/cube_2048/4/23299cf008f59d4d48cea2b290b2d4d0/4_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "images/cube_2048/4/23299cf008f59d4d48cea2b290b2d4d0/4_u.jpg"
            },
            {
                "back": "images/cube_2048/5/8b1bfc2a441a1ca70d39e765142e2264/5_b.jpg",
                "down": "images/cube_2048/5/8b1bfc2a441a1ca70d39e765142e2264/5_d.jpg",
                "front": "images/cube_2048/5/8b1bfc2a441a1ca70d39e765142e2264/5_f.jpg",
                "index": 5,
                "left": "images/cube_2048/5/8b1bfc2a441a1ca70d39e765142e2264/5_l.jpg",
                "right": "images/cube_2048/5/8b1bfc2a441a1ca70d39e765142e2264/5_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "images/cube_2048/5/8b1bfc2a441a1ca70d39e765142e2264/5_u.jpg"
            },
            {
                "back": "images/cube_2048/6/54fbcff27c61e600a737b14c6ad174f1/6_b_DxHKnC.jpg",
                "down": "images/cube_2048/6/54fbcff27c61e600a737b14c6ad174f1/6_d.jpg",
                "front": "images/cube_2048/6/54fbcff27c61e600a737b14c6ad174f1/6_f.jpg",
                "index": 6,
                "left": "images/cube_2048/6/54fbcff27c61e600a737b14c6ad174f1/6_l.jpg",
                "right": "images/cube_2048/6/54fbcff27c61e600a737b14c6ad174f1/6_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "images/cube_2048/6/54fbcff27c61e600a737b14c6ad174f1/6_u.jpg"
            },
            {
                "back": "images/cube_2048/7/276c66b0b4598e3afc1fab2ad346863f/7_b.jpg",
                "down": "images/cube_2048/7/276c66b0b4598e3afc1fab2ad346863f/7_d.jpg",
                "front": "images/cube_2048/7/276c66b0b4598e3afc1fab2ad346863f/7_f.jpg",
                "index": 7,
                "left": "images/cube_2048/7/276c66b0b4598e3afc1fab2ad346863f/7_l.jpg",
                "right": "images/cube_2048/7/276c66b0b4598e3afc1fab2ad346863f/7_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "images/cube_2048/7/276c66b0b4598e3afc1fab2ad346863f/7_u.jpg"
            },
            {
                "back": "images/cube_2048/8/029cdc543b2b28ba535e4fcb58d2655a/8_b.jpg",
                "down": "images/cube_2048/8/029cdc543b2b28ba535e4fcb58d2655a/8_d.jpg",
                "front": "images/cube_2048/8/029cdc543b2b28ba535e4fcb58d2655a/8_f.jpg",
                "index": 8,
                "left": "images/cube_2048/8/029cdc543b2b28ba535e4fcb58d2655a/8_l.jpg",
                "right": "images/cube_2048/8/029cdc543b2b28ba535e4fcb58d2655a/8_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "images/cube_2048/8/029cdc543b2b28ba535e4fcb58d2655a/8_u.jpg"
            },
            {
                "back": "images/cube_2048/9/3a55225941621abddbbbf1c39df0b6e8/9_b.jpg",
                "down": "images/cube_2048/9/3a55225941621abddbbbf1c39df0b6e8/9_d.jpg",
                "front": "images/cube_2048/9/3a55225941621abddbbbf1c39df0b6e8/9_f.jpg",
                "index": 9,
                "left": "images/cube_2048/9/3a55225941621abddbbbf1c39df0b6e8/9_l.jpg",
                "right": "images/cube_2048/9/3a55225941621abddbbbf1c39df0b6e8/9_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "images/cube_2048/9/3a55225941621abddbbbf1c39df0b6e8/9_u.jpg"
            },
            {
                "back": "images/cube_2048/10/963faab09d7ab6f0df158427bd5f5f78/10_b.jpg",
                "down": "images/cube_2048/10/963faab09d7ab6f0df158427bd5f5f78/10_d.jpg",
                "front": "images/cube_2048/10/963faab09d7ab6f0df158427bd5f5f78/10_f_BsnEgZ.jpg",
                "index": 10,
                "left": "images/cube_2048/10/963faab09d7ab6f0df158427bd5f5f78/10_l.jpg",
                "right": "images/cube_2048/10/963faab09d7ab6f0df158427bd5f5f78/10_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "images/cube_2048/10/963faab09d7ab6f0df158427bd5f5f78/10_u.jpg"
            },
            {
                "back": "images/cube_2048/11/a5c249ba52d08a81f53843af55dc9263/11_b.jpg",
                "down": "images/cube_2048/11/a5c249ba52d08a81f53843af55dc9263/11_d.jpg",
                "front": "images/cube_2048/11/a5c249ba52d08a81f53843af55dc9263/11_f.jpg",
                "index": 11,
                "left": "images/cube_2048/11/a5c249ba52d08a81f53843af55dc9263/11_l.jpg",
                "right": "images/cube_2048/11/a5c249ba52d08a81f53843af55dc9263/11_r_AxbxKO.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "images/cube_2048/11/a5c249ba52d08a81f53843af55dc9263/11_u.jpg"
            },
            {
                "back": "images/cube_2048/12/4f9804b72a6f187f9f059357df873ac5/12_b.jpg",
                "down": "images/cube_2048/12/4f9804b72a6f187f9f059357df873ac5/12_d.jpg",
                "front": "images/cube_2048/12/4f9804b72a6f187f9f059357df873ac5/12_f_iHHooD.jpg",
                "index": 12,
                "left": "images/cube_2048/12/4f9804b72a6f187f9f059357df873ac5/12_l_vDcAwi.jpg",
                "right": "images/cube_2048/12/4f9804b72a6f187f9f059357df873ac5/12_r_cxGcNT.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "images/cube_2048/12/4f9804b72a6f187f9f059357df873ac5/12_u.jpg"
            },
            {
                "back": "images/cube_2048/13/aeb193c1b856d8cef58841866efcb232/13_b.jpg",
                "down": "images/cube_2048/13/aeb193c1b856d8cef58841866efcb232/13_d.jpg",
                "front": "images/cube_2048/13/aeb193c1b856d8cef58841866efcb232/13_f_eJojnB.jpg",
                "index": 13,
                "left": "images/cube_2048/13/aeb193c1b856d8cef58841866efcb232/13_l_wdyzwj.jpg",
                "right": "images/cube_2048/13/aeb193c1b856d8cef58841866efcb232/13_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "images/cube_2048/13/aeb193c1b856d8cef58841866efcb232/13_u.jpg"
            },
            {
                "back": "images/cube_2048/14/bc9f9ede64c80fa5b3da060c8ef0f96e/14_b.jpg",
                "down": "images/cube_2048/14/bc9f9ede64c80fa5b3da060c8ef0f96e/14_d.jpg",
                "front": "images/cube_2048/14/bc9f9ede64c80fa5b3da060c8ef0f96e/14_f_anCzEy.jpg",
                "index": 14,
                "left": "images/cube_2048/14/bc9f9ede64c80fa5b3da060c8ef0f96e/14_l.jpg",
                "right": "images/cube_2048/14/bc9f9ede64c80fa5b3da060c8ef0f96e/14_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "images/cube_2048/14/bc9f9ede64c80fa5b3da060c8ef0f96e/14_u.jpg"
            },
            {
                "back": "images/cube_2048/15/9ba67916d2101b0dbd0865480093525b/15_b.jpg",
                "down": "images/cube_2048/15/9ba67916d2101b0dbd0865480093525b/15_d.jpg",
                "front": "images/cube_2048/15/9ba67916d2101b0dbd0865480093525b/15_f.jpg",
                "index": 15,
                "left": "images/cube_2048/15/9ba67916d2101b0dbd0865480093525b/15_l.jpg",
                "right": "images/cube_2048/15/9ba67916d2101b0dbd0865480093525b/15_r_VzMfzy.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "images/cube_2048/15/9ba67916d2101b0dbd0865480093525b/15_u.jpg"
            },
            {
                "back": "images/cube_2048/16/060ced1cc1fb41152620de361968b957/16_b.jpg",
                "down": "images/cube_2048/16/060ced1cc1fb41152620de361968b957/16_d.jpg",
                "front": "images/cube_2048/16/060ced1cc1fb41152620de361968b957/16_f.jpg",
                "index": 16,
                "left": "images/cube_2048/16/060ced1cc1fb41152620de361968b957/16_l.jpg",
                "right": "images/cube_2048/16/060ced1cc1fb41152620de361968b957/16_r.jpg",
                "tiles": [
                    1,
                    2
                ],
                "up": "images/cube_2048/16/060ced1cc1fb41152620de361968b957/16_u.jpg"
            }
        ]
    },
    "picture_url": "https://vrlab-public.ljcdn.com/release/auto3dhd/07f8f1f75da72e0432344652710024ed/screenshot/1642052055_1/pc0_Cp8NtRAFA.jpg",
    "title_picture_url": "https://vrlab-public.ljcdn.com/release/vradmin/5dcfc48f-5fc0-4ac8-b47d-7b644721bcbd_1000.jpg",
    "vr_code": "807vO5MXQV40N94XwG",
    "vr_type": "reality"
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
