import boto3
import redis
import StringIO
from multiprocessing import Process

REDIS_HOST = 'redis'

def s3upload(filename, file_obj):
    s3 = boto3.resource('s3')
    s3.Bucket('thehack').put_object(Key='upload/{}'.format(filename), Body=file_obj)

def s3prefix(prefix):
    s3 = boto3.resource('s3')
    bucket = s3.Bucket('thehack')

    latest = (None, None)
    for obj in bucket.objects.all():
        if obj.key.startswith(prefix):
            if latest[0] == None or obj.last_modified > latest[0]:
                latest = (obj.last_modified, obj.key)

    return latest[1]

def upload(token, filename, file_obj):
    db_status = redis.StrictRedis(host=REDIS_HOST, port=6379, db=3)
    try:
        s3upload(filename, file_obj)
        db_status.set(token, 'success')
    except Exception:
        db_status.set(token, 'failed')
    finally:
        file_obj.close()

def prefix(token, prefix):
    db_queue = redis.StrictRedis(host=REDIS_HOST, port=6379, db=2)
    db_result = redis.StrictRedis(host=REDIS_HOST, port=6379, db=6)

    try:
        result = s3prefix(prefix)
        db_result.set(token, result)
        db_queue.publish('download-channel', token)
    except Exception:
        pass

if __name__ == '__main__':
    db_filename = redis.StrictRedis(host=REDIS_HOST, port=6379, db=0)
    db_content = redis.StrictRedis(host=REDIS_HOST, port=6379, db=1)
    db_queue = redis.StrictRedis(host=REDIS_HOST, port=6379, db=2)
    db_operation = redis.StrictRedis(host=REDIS_HOST, port=6379, db=4)
    db_prefix = redis.StrictRedis(host=REDIS_HOST, port=6379, db=5)

    p = db_queue.pubsub()
    p.subscribe("upload-channel")
    for message in p.listen():
        token = message['data']

        operation = db_operation.get(token)
        if operation is None:
            continue

        if operation == 'upload':
            filename = db_filename.get(token)
            content = db_content.get(token)

            file_obj = StringIO.StringIO(content)
            file_obj.seek(0)

            p = Process(target=upload, args=(token, filename, file_obj))
            p.start()
        elif operation == 'prefix':
            query = db_prefix.get(token)

            p = Process(target=prefix, args=(token, query))
            p.start()
