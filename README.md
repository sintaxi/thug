Thug
===========================================================

Creating a basic store using `Thug` ...

    var store = new Thug()
    
    store.constructor.prototype.write = function(identifier, record, callback){
      // store the record any way you wish
      // fire callback with record
    }

    store.constructor.prototype.read = function(identifier, callback){
      // retrieve the record
      // invoke callback with record
    }

This gives us three basic methods `set`, `get`, `valid` ...
    
    store.set("foo", "bar", function(errors, record){
      // record => "bar"
    })
    
    store.valid("foo", "bar", function(record){
      // record => "bar"
    })
    
    store.get("foo", function(record){
      // record => "bar"
    })

What we have created is a basic key/value store using `Thug` nothing special yet. Thug has two basic building blocks for you to use `filters` and `validations`.

## Filters

Creating a filter is simple, just create a function that calls the next filter in the stack. Here is a simple filter that just logs the record to the console.

    var log = function(record, next){
      console.log(record)
      next(record)
    }

Now that we have a `filter` we put it in our model where we want it to be called. There are four different places within the lifecycle of a call that the filter can be called.

    var store = new Thug({
      filters: {
        in      : [],
        before  : [],
        after   : [],
        out     : []
      }
    })

### `in` filters

`in` filters are ran when the `set` and `valid` functions are first called. This is useful when black-listing or white-listing properties on the record before running the `validations` are ran.

### `before` filters

`before` filters are called immediately prior to `validations` being called but after the `read` function is called in the cases where there is and `identifier` passed in. This is were you will do most of your heavy lifting in constructing your object data before going to the store such as setting a timestamp, generating a uuid or creating a hash based on a password.

### `after` filters

`after` filters are ran immediately after `validations` are ran but still before the `write` function is called. This is the last opportunity to clean the data up before storing the record. For example, you may want to delete a naked password.

### `out` filters

`out` filters are ran immediately after the `write` function is ran. This is your opportunity to clean the data up before returning to the client.

## API

### `set([identifier,] record, callback)`

#### Lifecycle of a `set()` request

  1. record is passed through `in` filters
  2. `read` is called (if identifier is present)
  3. record is passed through `before` filters
  4. `validations` are ran

If record fails validation, we return back to the client. otherwise continue...

  5. record is passed through `after` filters
  6. `write` is called
  7. record is passed through `out` filters
  8. fires callback
    
### `valid([identifier,] record, callback)`

The `valid` call is a subset of `set`. It fires the callback after validations are ran.

#### Lifecycle of a `valid()` request

  1. record is passed through `in` filters
  2. `read` is called (if identifier is present)
  3. record is passed through `before` filters
  4. `validations` are ran
  5. fires callback
    
### `get(identifier, callback)`

The `get` function calls the `read` function and passes the record through the `out` filters.

#### Lifecycle of a `get()` request

  1. `read` is called
  2. if record is found, it is passed through `out` filters
  3. fires callback


Copyright 2012 Chloi Inc.
All rights reserved.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
