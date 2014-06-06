Tinytest.add("miniredis - reactivity - simple strings, pattern", function (test) {
  var S = new Miniredis.RedisStore();
  S.set("ab", "1");
  S.set("bb", "2");

  var aas = null;
  var c = Deps.autorun(function () {
    aas = S.patternFetch("a?");
  });

  test.equal(aas, ["1"]);

  S.set("ac", "2");
  Deps.flush();
  test.equal(aas, ["1", "2"]);

  S.set("ac", "5");
  Deps.flush();
  test.equal(aas, ["1", "5"]);

  S.set("ab", "4");
  Deps.flush();
  test.equal(aas, ["4", "5"]);

  S.set("bc", "3");
  Deps.flush();
  test.equal(aas, ["4", "5"]);

  S.set("bb", "5");
  Deps.flush();
  test.equal(aas, ["4", "5"]);

  S.del("ac");
  Deps.flush();
  test.equal(aas, ["4"]);

  S.set("ac", "12");
  Deps.flush();
  test.equal(aas, ["4", "12"]);

  debugger
  S.del("ab");
  debugger
  S.del("ac");
  debugger
  S.del("bb");
  debugger
  S.del("bc");
  Deps.flush();
  test.equal(_.keys(S._keyDependencies).length, 0, "keys are removed and so should be the deps");
  c.stop();
  Deps.flush();
  test.equal(_.keys(S._keyDependencies).length +
             _.keys(S._patternDependencies).length, 0,
    "All dependencies are unset as there are no more computations");
});

Tinytest.add("miniredis - reactivity - simple strings, single", function (test) {
  var S = new Miniredis.RedisStore();

  var magic = null;
  var c = Deps.autorun(function () {
    magic = S.get("magic");
  });

  test.equal(magic, null);

  S.set("magic", "abcd");
  Deps.flush();
  test.equal(magic, "abcd");

  S.set("magic", "debc");
  Deps.flush();
  test.equal(magic, "debc");

  S.del("magic");
  Deps.flush();
  test.equal(magic, null);

  S.set("magic", "123");
  Deps.flush();
  test.equal(magic, "123");

  c.stop();
  Deps.flush();
  test.equal(_.keys(S._keyDependencies).length +
             _.keys(S._patternDependencies).length, 0,
    "All dependencies are unset as there are no more computations");
});

