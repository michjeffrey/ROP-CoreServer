Manual of Reolink O pen Platfor m v.1.0
 
 
Ov erv iew
 
Obje ctive
 
To provi de partners with an i nstruction to deploy Reolink O pen Pl atform 
(RO P) and to configure and use the device.
 
Applicability
 
The manual is suitable for people who have some experi ence in server 

development and depl oyment.
 
Scope
 
The manual contai ns three parts: depl oyment of server, use of server, 

installati on and use of device.
 
 
Deploym ent of Server
 
 
Ha r dwa r e  Requi
rem ents
 
 
Minimum configuration for s erver host: dual
-
core CPU, 4GB RAM.
 
 
Software Requirem ents
 
 
Get the ins tallation package rop.tgz provided by Reolink
 
 
Us e mains tream Linux dis tributions . The Debian distribution is recommended.
 
 
Pre
-
install docker and 
docker
-
compose. You can refer to the content in
 
this  
link
.
 
 
Prepare a domain name pointing to the s erver hos t IP. Or, configure a 
permanent and unchanging
 
fixed IP address  for the s erver.
 
 
Ens ure
 
that the server
™
s  TCP ports 61008 and 61009 are open to clients
 
 
Ens ure that the server
™
s  TCP ports 61000
-
61007 are open to devices
 
 
Ens ure that the deployment is performed by a us er with docker us er group 

perm iss ions.

Assumptions
 
 
We as sume that our partn
ers  us e the adm in account to ins tall ROP.
 
 
We as sume that the installation path of ROP is /home/admin/
 
 
For First
-
Tim e Insta llation
 
In s t al l i n g  Core  S e rv e r (Requi re d)
 
 
Upload the ins tallation package to the installation directory and unzip it.
 
 
Upload the rop.
tgz package provided by Reolink to the installation 
directory /home/admin/.
 
 
Go to the ins tallation path: cd /home/admin/.
 
 
Execute the command 
ﬁ
tar 
-
zxf rop.tgz
ﬂ 
to extract the folder.
 
 
Enter the path of ROP: cd /home/admin/rop/.
 
 
Set the ROP s tartup configur
ation environment variables , which are s tored in 
the file 
ﬁ
docker
-
compose.yml
ﬂ.
 
 
The ROP_HOSTNAME should be the Core Server
™
s  s erver domain name or 
unchanging fixed IP addres s. For example: 
www.rop.com.
 
 
RTSP_PLAY_URL_PREF
IX is  the prefix of the RTSP s treaming URL. Becaus e
 
the RTSP s treaming URL may be encrypted, a prefix is  required when 
generating the addres s on the server side. The prefix includes  three parts : 
protocol, s erver addres s , and port. For example, 
rts p://www.rop.com:61008
 
 
ROP_ALARM_W EBHOOK is  the addres s  that ROP us es  to reques t callback
 
when a device generates  an alarm, and the authentication is  ensured by 

the addres s. For example, 
https ://www.customer.server.com/alarm?key
 
=Aa1zplGq4pySXEELHBSznbnw
jqPbcHK4tl. If this feature is  not needed, 
the field can be left blank.
 
 
After modifying the ROP s tartup configuration, execute the command 

ﬁ
docker
-
compose up 
-
d
ﬂ 
to start the container.
 
C au t i on
 
 
A self
-
s igned root CA will be generated once the s erver is  dep
loyed. If the 
s elf
-
s igned root CA is damaged, all devices  will not be able to connect to the 
s erver. Therefore, it is recommended to back up the s elf
-
s igned root CA. The 
path of the s elf
-
s igned root CA is /home/admin/rop/data/certs/.
 
 
There is  important con
figuration information in the configuration file. It is  
recommended to back up the configuration file. The path of the configuration 

file is /home/admin/rop/data/config.json

F or  ROP Code Upda te
 
For s ervers  that have ROP and only need to update code.
 
O ve rwri t i n g  t h e  Code  of  Core  S e rve r
 
 
Upload the ins tallation package to the temporary directory (/home/admin/) 
and unzip it.
 
 
Upload rop.tgz package provided by Reolink to the ins tallation directory: 

/home/admin/tmp/
 
 
Enter the temporary directory: cd/home/ad
min/tmp/
 
 
Execute the command 
ﬁ
tar 
-
zxf rop.tgz
ﬂ 
to unzip the folder
 
 
Execute the command 
ﬁ
rm 
-
rf/home/admin/rop/app/
ﬂ 
to delete the 
original code
 
 
Execute the command 
ﬁ
cp 
-
rf /home/admin/tmp/rop/app/ 
/
home/admin/rop/app/
ﬂ 
to copy new code to the running dire
ctory
 
Restarting the Container
 
 
Execute the command 
ﬁ
docker restart rop
-
core
-
s erver
ﬂ 
to res tart it.
 
Use of Serv er
 
Functions of Core Server
 
 
Function
 
Description
 
Prerequisites
 
Related 
 
Interfaces
 
Related 
Protocols
 
Note
 
Init ia lizing the 
dev ic e
 
Init ia lize t he
 
dev ic e to ROP 
working 

m ode.
 
1.
 
D evic e 
ne twor k is 

configured and 

connected.
 
ﬁ
Cre at e the D ev ice 
Initia lization 
Session
ﬂ
 
in 
ﬁ
Interfac es
ﬂ
 
HTTP/
 
HT TPS
 
 
Getting/setting 
the dev ice 
name
 
1.
 
Get the  
dev ic e name.
 
2.
 
Set the  
dev ic e name.
 
1. 
Devic e  
ne twor k is 
configured and 
connected.
 
2. 
D evic e is 
init ialize d.
 
1.
 
ﬁ
Get the Display  
Name of the 
Device
ﬂ
 
in 
ﬁ
Interfac es
ﬂ
 
2.
 
ﬁ
Set the Display  
Name of the 
Device
ﬂ
 
in 
ﬁ
Interfac es
ﬂ
 
HTTP/
 
HT TPS
 
The acquir ed 
informat ion ha s 
a va lidity period. 
The  defa ult 
validit y  period is 
1 m in, whic h ca n 
be  
change d in 
the 
configuration 
file.

Function
 
Description
 
Prerequisites
 
Related 
 
Interfaces
 
Related 
Protocols
 
Note
 
Getting (the 
st at us of)/
 
enabling/
 
disabling t he 

dev ic e
™
s alarm 
notification 
 
1.
 
Get the  
status of the 
dev ic e
™
s a larm 
notification.
 
2.
 
Enable/
 
disable the 

dev ic e
™
s a larm 
notification.
 
1.
 
D evic e 
ne twor k is 

configured and 

connected.
 
2. Device is 

init ialize d.
 
1.
 
ﬁ
Get the Status 
of the Dev ice
™
s 
Alarm  
Notification
ﬂ
 
in 
ﬁ
Interfac es
ﬂ
 
2.
 
ﬁ
Ena ble/Disable 
the D evice
™
s Alar m  
Notification
ﬂ
 
in 
ﬁ
Interfac es
ﬂ
 
HTTP/
 
HT TPS
 
With the alarm 
notification on 
the dev ice 

enabled, t he  
ROP server  will 
sen
d a  POST 
reque st  to the 
set address once 

the dev ice 
generates an 

alarm 
notification. For 
m ore deta ils, see 
the 
ﬁ
Int er faces
ﬂ 
document .
 
Watching the 
live vie w of the 
dev ic e
 
Get the  live 
view st ream 
of the  device 
and watch it 
via  t he player.
 
1.
 
D evic e 
ne twor k 
is 
configured and 
connected.
 
2. Device is 
init ialize d.
 
1. 
ﬁ
Reque st  the 
Live View Address
ﬂ
 
in 
ﬁ
Int erfac es
ﬂ
 
1. Use  
HTTP/
 
HTTPS for 
signals
 
 
1.
 
Use 
RTSP/
 
RTSPS for 
st ream s
 
1. It is 
recommende d 
to use  TCP as the 
transmission 
protocol of  RT SP.
 
Watching the 
play bac k of  the 

dev ic e
 
1.
 
Get the  
dev ic e
™
s list  of 
recordings.
 
2.
 
Get the  
st ream  of the 
dev ic e 
play bac k and 
watch it via 
the player.
 
1.
 
D evic e 
ne twor k is 
configured and 
connected.
 
2. Device is 
init ialize d.
 
1. 
ﬁ
Get the Date s 
with Recordings in 
a  Calendar  M ont h
ﬂ
 
in 
ﬁ
Int erfac es
ﬂ
 
2.
 
ﬁ
Get t he  List  of 
Recordings of the 
Device in a  
Calendar Day
ﬂ
 
in 
ﬁ
Interfac es
ﬂ
 
3.
 
ﬁ
Request t he 
Recording 
Playback Address
ﬂ
 
in 
ﬁ
Int erfac es
ﬂ
 
 
1.
 
Use 
HTTP/
 
HTTPS for 
signals
 
 
2. Use 
RTSP/
 
RTSPS for 
st ream s
 
1. It is 

recommende d 
to use  TCP as the 
transmission 

protocol of  RT SP.

Function
 
Description
 
Prerequisites
 
Related 
 
Interfaces
 
Related 
Protocols
 
Note
 
D evic e 
firmware 
update
 
Updat e t he 
firmware 
version of  the  
dev ic e.
 
1.
 
Upload the  
firmwar e file  
(suffix m ust  be 
pak or pa k s) to 
/home/admin
/rop/dat a/fir
m ware
 
2.
 
D evic e 
ne twor k is 
configured and 
connected.
 
3.
 
D evic e is 
init ialize d.
 
1.
 
ﬁ
Create  the 
F ir mware Update 
Session
ﬂ
 
in 
ﬁ
Interfac es
ﬂ
 
2.
 
ﬁ
Get the Status 
of F irmwar e 
Update
ﬂ
 
in 
ﬁ
Interfac es
ﬂ
 
HTTP/
 
HT TPS
 
 
Get the  
real
-
time 
snapshot t a ken 
by the device
 
Get the  
real
-
time 
snapshot 

taken by the 
dev ic e
 
1.
 
D evic e 
ne twor k is 

configured and 
connected.
 
2.
 
D evic e is 
init ialize d.
 
1.
 
ﬁ
Get the 
Rea l
-
Time  
Sna pshot Ta ken by  
the D evice
ﬂ
 
in 
ﬁ
Interfac es
ﬂ
 
HTTP/
 
HT TPS
 
Cannot operate 

t he of fline  
dev ic es
 
Get the  
real
-
time 
battery  status 
of the  device
 
Get the  
real
-
time 
battery  status 
of the  device
 
1.
 
D evic e 
ne twor k is 
configured and 
connected.
 
2.
 
D evic e is 
init ialize d.
 
1,
 
ﬁ
Get the 
Rea l
-
Time Battery 
Status of the  
Device
ﬂ 
in 
ﬁ
Interfac es
ﬂ
 
HTTP/
 
HT TPS
 
Cannot operate 
t he offline  
dev ic es
 
Get/Set the PIR 
alarm 
notification 

configuration 
of the  device
 
1.
 
Get the  PIR 
alarm 
notification 

configuration 
of the  device
 
2.
 
Set  t he  PIR 
alarm 

notification 
configuration 

of the  device
 
1.
 
D evic e 
ne twor k is 

configured and 

connected.
 
2.
 
D evic e is 
init ialize d.
 
1.
 
ﬁ
Get the PIR 
Alarm  Notif ic ation 
Configurat ion of 
the D evice
ﬂ 
in 
ﬁ
Interfac es
ﬂ
 
2.
 
ﬁ
Set t he PIR
 
Alarm  Notif ic ation 
Configurat ion of 
the D evice
ﬂ 
in 
ﬁ
Interfac es
ﬂ
 
HTTP/
 
HT TPS
 
Cannot operate 
t he of fline  
dev ic es

Function
 
Description
 
Prerequisites
 
Related 
 
Interfaces
 
Related 
Protocols
 
Note
 
Control t he PT Z 
funct ion of t he 
dev ic e
 
1.
 
Set the  
m agnificat ion 
t imes for 
optica l zoom  
of the  device
 
2.
 
Set  the PTZ 
foca l length of 
the device
 
3.
 
Control t he 
PTZ rot at ion 
funct ion of 
the device
 
1.
 
D evic e 
ne twor k is 
configured and 
connected.
 
2.
 
D evic e is 
init ialize d.
 
1.
 
ﬁ
Set t he 
Magnif ic ation 
Times for Optical 
Zoom of  t he 
Device
ﬂ 
in 
ﬁ
Interfac es
ﬂ
 
2.
 
ﬁ
Set the PTZ 
Foc al Lengt h of  
the D evice
ﬂ 
in 
ﬁ
Interfac es
ﬂ
 
3.
 
ﬁ
Cont r o
l t he PTZ 
Rotation Function 
of the Dev ice
ﬂ 
in 
ﬁ
Interfac es
ﬂ
 
HTTP/
 
HT TPS
 
Cannot operate 
t he offline  
dev ic es
 
Get the list of 
online devices
 
Get the list of 

dev ic es 
c urrently  
online
 
-
 
1.
 
ﬁ
Get t he List of 
Online  Dev ices
ﬂ
 
in 
ﬁ
Interfac es
ﬂ
 
HTTP/
 
HT TPS
 
Cannot operate
 
t he of fline  
dev ic es
 
Get/set the 
WiFi 

configuration 
of the  device
 
1.
 
Get the  WiFi 
configuration 

of the  device
 
2.
 
Set the  WiFi 
configuration 

of the  device
 
1.
 
D evic e 
ne twor k is 
configured and 

connected.
 
2.
 
D evic e is 
init ialize d.
 
3.
 
D evic e 
supports WiFi.
 
1.
 
ﬁ
Get the WiFi
 
configuration of 
the device
ﬂ 
in 
ﬁ
Interfac es
ﬂ
 
2.
 
ﬁ
Set the WiFi 
configuration of 
the device
ﬂ 
in 
ﬁ
Interfac es
ﬂ
 
HTTP/
 
HT TPS
 
Cannot operate 

t he of fline  
dev ic es
 
Start  scanning 

the WiFi list on 
the device
 
Start  sc anning 
t he WiFi list of 
the device
 
1.
 
D evic e 
ne twor k is
 
configured and 

connected.
 
2.
 
D evic e is 
init ialize d.
 
3.
 
D evic e 
supports WiFi.
 
1.
 
ﬁ
St art scanning 
the WiF i list of  the 
dev ice
ﬂ 
in 
ﬁ
Interfac es
ﬂ
 
HTTP/
 
HT TPS
 
Cannot operate 
t he of fline  
dev ic es
 
Get t he WiFi list 
scanned on the 
dev ic e 
 
Get the  WiFi
 
list scanne d 

on t he device
 
1.
 
D evic e 
ne twor k is 

configured and 

connected.
 
2.
 
D evic e is 
init ialize d.
 
3.
 
D evic e 
supports WiFi.
 
1.
 
ﬁ
Get the WiF i list 
sca nne d on the  
dev ice
ﬂ 
in 
ﬁ
Interfac es
ﬂ 
 
HTTP/
 
HT TPS
 
Cannot operate 
t he of fline  
dev ic es

Function
 
Description
 
Prerequisites
 
Related 
 
Interfaces
 
Related 
Protocols
 
Note
 
Test the 
ava ila bilit y of 
WiFi 
 
Test the 
ava ila bility of 
WiFi 
 
1.
 
D evic e 
ne twor k is 

configured and 

connected.
 
2.
 
D evic e is 
init ialize d.
 
3.
 
D evic e 
supports WiFi.
 
1.
 
ﬁ
Test the 
availa bility of WiFi
ﬂ 
in 
ﬁ 
Inter face s
ﬂ
 
HTTP/
 
HT TPS
 
Cannot operate 
t he of fline  
dev ic es
 
 
Importa nt Configuration Item s of Core 
Serv er
 
Configurati on files are in JSON format and l ocated in 
/home/admi n/rop/data/config.json.
 
 
Field
 
Path
 
Description
 
Type
 
Value Range
 
Note
 
server Host
 
Under t he 
root path
 
IP address or 
doma in name  of 
the server
 
St ring
 
Less t ha n 255 

byte s
 
If deployed to 

an IP address, 

it must be 
a 
perm anent and 
unc hanging
 
fix ed one. A 
domain name, 
instead of a 

fixed IP 

address, is 

st rongly  
recommende d.
 
play URLPr ef ix
 
Under t he 
RTSP pat h
 
Pref ix of  the RTSP 
str eaming a ddr e ss, 
cont aining 
protocol, domain 
name,
 
and por t 
number. Defa ult: 
rtsp://${server Hos
t}:61008
 
String
 
Less t ha n 255 
byte s
 
When using an 
encrypted 
connection, 
t he pr efix 
should be
 
rt sps:// ${server
Host}: 61010

Field
 
Path
 
Description
 
Type
 
Value Range
 
Note
 
encryptM ode
 
Under t he 
dev ic eStream 
path
 
Met hod of  
encrypting str eam 
transmission 

betwe en
 
device 
and ROP. The 
ava ila ble types are 
full enc ry ption, 

selective 
encryption, and 
non
-
encry pt ion.
 
St ring
 
ﬁ
TLS
ﬂ, ﬁ
TCP
ﬂ, 
or 
ﬁ
encry ptTCP
ﬂ
 
 
notificationU RL
 
Under t he 
alarm pat h
 
Alarm notification 
callback  a ddress
 
String
 
Less t ha n 255 
byte s
 
 
dev ic eKeys
 
Under t he 
devic eAut h 
path
 
Key  pa irs t he 
dev ic e has used.
 
M ap. 
M apping 
from  
accessKey
 
to 
secretAcc

essKey .
 
acc essKey  is 

a st ring of 1 6 
byte s.
 
S
ecretAccess
Key is a  st ring 
of 32  bytes.
 
Very  

im port ant . 
Once lost, the  
battery
-
power
ed devices are  

not able to 
con
nect to the  
server.
 
currentKeyIndex
 
Under t he 
devic eAut h 
path
 
The ac cessKey 
that all devices 
should c urrent ly 
use
 
String
 
A string of  16 
byte s.
 
 
signKey
 
Under t he 

aut hCode 
path
 
Signat ure use d to 

issue  the 
init ialization 

aut horizat ion 

code to the device
 
St ring
 
A st ring of  32  

byte s.
 
Very  

im port ant . 
Onc e lost, it 
will aff ect the 
dev ic e 

certificate 
refr esh.
 
 
Serv er Ports
 
The default ports of ROP.  Partners can modi fy the ports by themselves.
 
 
 
Default Ports of Core Server
 
Port
 
Use
 
Note
 
61000
 
Used by the 
devic e to download the 
server
™
s self
-
signed root  CA certificat e
 
Used in dev ice init ialization
 
61001
 
Used by the devic e  to get  devic e 
certificate and certificate chain
 
D evic e certif ic ate is used for  
dev ic e authentication

Port
 
Use
 
Note
 
61002
 
Used by the devic e  to 
re gister  with the  
server  and get the TCP enc ryption 
negotiation k ey
 
The obta ined key is used to 

negot iate  the  enc ryption of the 

TCP connec t ion
 
61003
 
To ke ep the  connection with 
battery
-
powered dev ic es alive
 
Used to keep the connec t ion 
betwe en batte ry
-
powe
r ed 
dev ic es a nd se rver
 
61005
 
For T LS conne c t ion of signals
 
Used to transmit signals between 
server  and dev ice
 
61006
 
For T LS conne c t ion of strea ms 
 
Used to send stream s from  device 
to client  wit h f ull enc ry pt ion.
 
61007
 
For TCP connection of strea ms
 
Used 
to send stream s from  device 
to client with selective  encryption 
or non
-
enc ryption.
 
61008
 
For client
™
s RTSP reque st
 
Used by client to obt a in RTSP 
st ream s
 
61009
 
For client
™
s HT TP r equest
 
Used for  client
™
s signal re quest s
 
 
 
Default Ports of Optional 
Components
 
Port
 
Use
 
Note
 
61004
 
For client
™
s RTSPS reque st
 
Used to transmit  RTSPS streams 
betwe en client and server
 
61010
 
For client
™
s HT TPS request
 
Used to transmit HTTPS signals 
betwe en client and server
 
 
O ptiona l Compone nt Instr uctions 
-
 
Clie nt 
Gateway
 
The Client Gateway i s implemented with Nginx.
 
 
If Nginx is us ed for Client Gateway to s ecure the trans mission between the 
Client and Core Server, the partners  need to configure certificates  and rotate 
them periodically.
 
 
The partners  can als o us e 
cipher suites from cloud s ervice providers  to s ecure 
the trans mis sion between Client and Core Server. For example, using ELB from 

AWS for HTTP encryption.
 
 
Example of us ing Nginx to configure HTTPS encryption.

Example of us ing Nginx to configure RTSPS encryption
 
 
 
server 
{ 
 
listen
 
 
6101
0
 
ssl http2
; 
 
server_name
 
amazon
-
us
-
east
-
1
a
.
stream
.
reolink
.
com
; 
 
 
ssl_certificate
 
 
/
data
/
certs
/
fullchain
.
pem
; 
 
ssl_certificate_key
 
/
data
/
certs
/
key
.
pem
; 
 
 
ssl_protocols TLSv1
.2 
TLSv1
.3
; 
 
ssl_ciphers ECDHE
-
RSA
-
AES256
-
SHA384
:
AES256
-
 
 
SHA256
:
RC4
:
HIGH
:
!
MD5
:
!
aNULL
:
!
eNULL
:
!
NULL
:
!
DH
:
!
EDH
:
!
AESGCM
; 
 
ssl_prefer_server_ciphers on
; 
 
ssl_session_timeout 
10
m
;
 
sendfile on
; 
 
 
location 
/ 
{ 
 
 
proxy_pass http
:
//127.0.0.1:61009; 
 
} 
 
 
} 
 
upstream rtsp_server 
{ 
 
server 
127.0.0.1
:
61008
; 
 
} 
 
 

server
{ 
 
listen 
61010 
ssl
; 
 
ssl_certificate
 
 
/
data
/
certs
/
fullchain
.
pem
; 
 
ssl_certificate_key
   
/
data
/
certs
/
key
.
pem
; 
 
tcp_nodelay on
; 
 
ssl_session_cache off
; 
 
ssl_session_timeout
  
10
m
; 
 
ssl_protocols TLSv1
.2 
TLSv1
.3
; 
 
ssl_ciphers 
 
HIGH
:
!
aNULL
:
!
MD5
; 
 
ssl_prefer_server_ciphers 
 
on
; 
 
proxy_pass rtsp_server
; 
 
}

O ptiona l Compone nt Instr uctions 
-
 
Authe nticator
 
Use Ngi nx to enable HTTP basi c authenticati on.
 
 
 
Example of us ing Nginx to configure Authentication
.
 
 
Refer to the content in 
this link
 
for details  about how to generate htpass wd 
files .
 
 
Header Authorization needs  to be added in the client request when using the 
Authenticator provided by Reolink. Refer to content in 
this  link
 
for details
 
 
Cross
-
Domain 
Configur ation Instr uctions
 
If the partner uses a webpage to connect to the ROP server, it i s necessary 
to solve the cross
-
domai n problem. The Core Server does not provide 
cross
-
domain support.
 
 
It is  recommended to s et up cross
-
domain configuration in the Client Gateway. 
Reolink provides  an example of using Nginx for Cross
-
Domain Configuration.
 
{
 
location
 
/ 
{
 
auth
_
basic
 
          
"
ROP
"
;
 
auth
_
basic
_
user
_
file
 
conf
/
htpasswd
;
 
}
 
}

Ca ution
 
 
The certificates for optional components  (/data/certs/fullchain.pem and 
/data/certs/key.pem) need to be downloaded and maintained by partners  
themselves.
 
 
Instr uctions on de vice initialization and configura tion
 
Upgrade device to ROP
 
version
 
Unzip Firmware.tgz provided by Reolink and find 
the 
.
pak or 
.
paks  file, which is the 
firmware used for ROP.
 
For a power camera, please 
s ee
 
the guide 
on the Reolink webs ite
 
for upgrade 
via
 
Reolink Client on your 
PC: 
https://s upport.reolink.com/hc/en
-
s/Articles/900004550323
-
how
-
to
-
Upgrade
-
FI
RMWARE
-
VIA
-
Reolink
-
Client
-
New
-
Client
-
//
 
For a battery
-
powered
 
camera, pleas e 
s ee
 
the guide on the Reolink
 
webs ite for 
upgrade with an SD card
:
 
https://s upport.reolink.com/hc/en
-
us/articles/15038092365465
-
Howto
-
Manually
-
Upgrade
-
Firmware
-
for
-
Reolink
-
W
iFi
-
Battery
-
Powered
-
Cameras
-
/
 
{
 
location
 
/ 
{
 
add
_
header
 
'
Access
-
Control
-
Allow
-
Origin
' 
$
http
_
origin
 
always
;
 
add
_
header
 
'
Access
-
Control
-
Allow
-
Headers
'
 
'
Authorization
,
Accept
,
Origin
,
Keep
-
Alive
,
User
-
Agent
,
X
-
Requested
-
With
,
 
If
-
Modified
-
Since
,
Cache
-
Control
,
Content
-
Type
,
Content
-
Range
,
Range
' 
always
;
 
add
_
header
 
'
Access
-
Control
-
Allow
-
Methods
'
 
'
GET
,
POST
,
OPTIONS
,
PUT
,
DELETE
,
PATCH
' 
always
;
 
if
 
(
$
request
_
method
 
= 
'
OPTIONS
'
) {
 
add
_
header
 
'
Access
-
Control
-
Allow
-
Origin
' 
$
http
_
origin
 
always
;
 
add
_
header
 
'
Access
-
Control
-
Allow
-
Headers
'
 
'
Authorization
,
Accept
,
Origin
,
Keep
-
Alive
,
User
-
Agent
,
X
-
Requested
-
With
,
 
If
-
Modified
-
Since
,
Cache
-
Control
,
Content
-
Type
,
Content
-
Range
,
Range
' 
always
;
 
add
_
header
 
'
Access
-
Control
-
Allow
-
Methods
'
 
'
GET
,
POST
,
OPTIONS
,
PUT
,
DELETE
,
PATCH
' 
always
;
 
add
_
header
 
'
Access
-
Control
-
Max
-
Age
' 
172800
;
 
add
_
header
 
'
Content
-
Type
''
text
/
plain
 
charset
=
UTF
-
8'
;
 
add
_
header
 
'
Content
-
Length
' 
0
;
 
return
 
204
;
 
}
 
proxy
_
pass
 
http
:
//127.0.0.1:61009;
 
}
 
}

Device initialization and 
ROP 
configuration
 
 
Cam era
 
supports network cable
 
For details, see 
Manual of Reolink Open Platform v.1.0 
-
 
ROP Configuration 
via LAN
 
 
Camera 
supports WiFi only
 
STEP 1: Configure WiFi (to be updated)
 
STEP 2: Configure ROP via LAN. 
For details , s ee 
Manual of Reolink Open 
Platform v.1.0 
-
 
ROP Configuration via LAN
 
 
Camera 
supports 4G only
 
Ins tall the app provided by Reolink for configuring ROP, 
app
-
Reolink
-
4.36.0.4.20230331.apk
 
Set up the camera using the
 
Reolink app. For details , s ee 
https://s upport.reolink.com/hc/en
-
us/articles/360012300954/
 
 
After the device is added and connected, go to the Remote Configuration 
page and s elect 
Advanced
, as  s hown below.

Generate QR code for ROP configuration
 
Obtain the device initialization information us ing the 
Create device 
initialization s ession
 
interface
 
included in
 
Reolink Open Platform
 
v1.0. 
Generate 
a 
QR code with the device initialization information for ROP 
configuration. Note: The QR code is  valid for 1 minute. 
If
 
an expired QR 
code 
is us ed, the app will return 
ﬁ
failure
ﬂ
.
 
Select ROP on the app and s can the QR code.

Caution
:
 
The camera firmware and Reolink app are ROP
-
s pecific. ROP configuration is 
not supported for other versions.
 
After ROP is  configured for the camera, change to the ROP mode. Reolink app 
cannot be connected to the device.
 
The camera mus t be connected to the 
s erver, which requires that the s erver us e 
a public IP or be in the s ame LAN as  the camera. For 4G devices , 
the 
ROP s erver 
mus t be deployed on a public network.

