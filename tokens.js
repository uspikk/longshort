const tokens = [
{
	"symbol":"HBC",//symbol of token
	"mode":"long",//long or short *long buys, then sells higher *short sells, then buys back lower
	"precent":0.02,//precent of tokens traded each interval
    "longshort":5//precent of profit to take
},
{
	"symbol":"HBC",
	"mode":"short",
	"precent":0.1,
	"longshort":5
},
{
	"symbol":"ENG",
	"mode":"long",
	"precent":0.02,
    "longshort":5
},
{
	"symbol":"ENG",
	"mode":"short",
	"precent":0.1,
	"longshort":5
},
{
	"symbol":"DEC",
	"mode":"long",
	"precent":0.02,
    "longshort":5
},
{
	"symbol":"DEC",
	"mode":"short",
	"precent":0.1,
	"longshort":5
},
{
	"symbol":"WEED",
	"mode":"long",
	"precent":0.02,
    "longshort":5
},
{
	"symbol":"WEED",
	"mode":"short",
	"precent":0.1,
	"longshort":5
},
{
	"symbol":"PAL",
	"mode":"short",
	"precent":0.1,
	"longshort":5
},
{
	"symbol":"LEO",
	"mode":"long",
	"precent":0.02,
	"longshort":5
},
{
	"symbol":"LEO",
	"mode":"short",
	"precent":0.1,
	"longshort":5
},
{
	"symbol":"PHOTO",
	"mode":"short",
	"precent":0.1,
	"longshort":5
},
{
	"symbol":"LIFESTYLE",
	"mode":"short",
	"precent":0.1,
	"longshort":5
},
{
	"symbol":"STARDUST",
	"mode":"short",
	"precent":0.1,
	"longshort":5
},
{
	"symbol":"STARDUST",
	"mode":"long",
	"precent":0.01,
	"longshort":5
},
{
	"symbol":"SIM",
	"mode":"long",
	"precent":0.01,
	"longshort":5
},
{
	"symbol":"SIM",
	"mode":"short",
	"precent":0.1,
	"longshort":5
}
]
module.exports = tokens