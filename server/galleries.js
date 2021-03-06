Meteor.publish('galleries', function() {
  return Galleries.find();
});

Meteor.publish('galleries-count', function() {
    Counts.publish(this, 'galleries', Galleries.find());
});

Meteor.smartPublish('limit-galleries', function(skip, limit){
    check(skip, Number);
    check(limit, Number);

    this.addDependency('cfs.galleries.filerecord', 'userId', function(gallery){
        return [
            Meteor.users.find({
                _id: gallery.userId
            }, {
                fields: {
                    'profile.nickName': 1
                }
            }),
            Profiles.find({
                userId: gallery.userId
            })
        ];
    });

    return Galleries.find({}, {
        skip: skip,
        limit: limit,
        sort: {
            uploadedAt: -1
        }
    });
});

Galleries.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    },
    download: function(){
        return true;
    },
    remove: function(){
        return true;
    }
});

Meteor.methods({
    deleteGallery: function(id){
         Galleries.remove({
             _id: id
         });
         Meteor.call('removeAllObjectTags', id, function(err, res){});
         return true;
    }
});
