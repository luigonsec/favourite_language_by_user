# Favourite language by Github user
Through this application you can know the favourite language of every github members. Just download the application, run it, and try it.


## Installation

After clone this project, `cd` into the folder and type:

```
npm install
```

After install packages and libraries, we can start the server running by typing:

```
sails lift
```

A message will be shown telling that the server is running in the 1337 port. So now we can access the main page of the application.


## Test

To run test simply type:

```
mocha test/bootstrap.test.js test/integration/**/*.test.js
```
Be sure to have Mocha installed:

```
npm mocha -v
```

If you doesn't have it installed:

```
npm install mocha -g
```

### Comments

Test could fails after running it a few times. This is due tu API limitations. We can run the test every time we want, but a problem it may happens when we beat the API limitations. I have no experience enough testing to implement a good logic in which the test automatically authenticate the user, and after that run all test, avoiding that way API limits.
